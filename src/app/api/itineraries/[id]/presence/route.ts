import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ItineraryPresence from "@/models/ItineraryPresence.model";
import RecentItineraryModel from "@/models/SavedItinerary.model";
import UserModel from "@/models/User.model";
import { getAuthSession, getSessionUserId } from "@/lib/authSession";
import { z } from "zod";

const PresenceHeartbeatSchema = z.object({
  status: z.enum(["viewing", "editing"]).default("viewing"),
  activeDayIdx: z.number().int().min(0).default(0),
});

const COLLABORATOR_COLORS = [
  "#10B981", // Emerald
  "#3B82F6", // Blue
  "#F59E0B", // Amber
  "#EC4899", // Pink
  "#8B5CF6", // Violet
  "#06B6D4", // Cyan
  "#F97316", // Orange
  "#6366F1", // Indigo
];

function getUserColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % COLLABORATOR_COLORS.length;
  return COLLABORATOR_COLORS[idx];
}

/**
 * GET /api/itineraries/[id]/presence
 * Retrieves currently active collaborators who sent a heartbeat within the last 45 seconds.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  try {
    const { id } = await params;
    const cutoff = new Date(Date.now() - 45000); // 45 seconds cutoff

    const collaborators = await ItineraryPresence.find({
      itineraryId: id,
      lastHeartbeat: { $gte: cutoff },
    })
      .sort({ lastHeartbeat: -1 })
      .lean();

    return NextResponse.json({ success: true, data: collaborators });
  } catch (error) {
    console.error("GET /api/itineraries/[id]/presence error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch presence" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/itineraries/[id]/presence
 * Updates user heartbeat and returns active collaborators.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  try {
    const session = await getAuthSession();
    const sessionUserId = getSessionUserId(session);
    if (!sessionUserId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const itinerary = await RecentItineraryModel.findById(id).lean();
    if (!itinerary) {
      return NextResponse.json({ success: false, message: "Itinerary not found" }, { status: 404 });
    }

    let body = {};
    try {
      body = await request.json();
    } catch {
      // empty or missing body defaults to viewing day 0
    }

    const parsed = PresenceHeartbeatSchema.safeParse(body);
    const status = parsed.success ? parsed.data.status : "viewing";
    const activeDayIdx = parsed.success ? parsed.data.activeDayIdx : 0;

    const user = await UserModel.findById(sessionUserId).lean();
    const userName = user?.name || user?.username || "Collaborator";
    const userAvatar = (user as any)?.avatar || (user as any)?.image || "";
    const color = getUserColor(sessionUserId);

    await ItineraryPresence.findOneAndUpdate(
      { itineraryId: id, userId: sessionUserId },
      {
        $set: {
          userName,
          userAvatar,
          color,
          status,
          activeDayIdx,
          lastHeartbeat: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    // Return current active list
    const cutoff = new Date(Date.now() - 45000);
    const collaborators = await ItineraryPresence.find({
      itineraryId: id,
      lastHeartbeat: { $gte: cutoff },
    })
      .sort({ lastHeartbeat: -1 })
      .lean();

    return NextResponse.json({ success: true, data: collaborators });
  } catch (error) {
    console.error("POST /api/itineraries/[id]/presence error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update presence" },
      { status: 500 }
    );
  }
}
