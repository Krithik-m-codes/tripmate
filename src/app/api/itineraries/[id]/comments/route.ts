import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import TripComment from "@/models/TripComment.model";
import RecentItineraryModel from "@/models/SavedItinerary.model";
import UserModel from "@/models/User.model";
import { getAuthSession, getSessionUserId } from "@/lib/authSession";
import { z } from "zod";

const CreateCommentSchema = z.object({
  targetType: z.enum(["itinerary", "day", "activity"]).default("itinerary"),
  targetId: z.string().min(1).default("general"),
  content: z.string().min(1, "Comment content cannot be empty"),
});

/**
 * GET /api/itineraries/[id]/comments
 * Retrieves all notes and discussion comments for a specific itinerary.
 * Supports query parameter ?targetId=... to filter by specific activity/day.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const targetId = searchParams.get("targetId");
    const targetType = searchParams.get("targetType");

    // Check if itinerary exists
    const itinerary = await RecentItineraryModel.findById(id).lean();
    if (!itinerary) {
      return NextResponse.json(
        { success: false, message: "Itinerary not found" },
        { status: 404 }
      );
    }

    // Check authorization (if not public, user must be owner or org member)
    const session = await getAuthSession();
    const sessionUserId = getSessionUserId(session);
    if (!itinerary.isPublic && itinerary.userId?.toString() !== sessionUserId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized to view comments on this itinerary" },
        { status: 401 }
      );
    }

    const query: Record<string, any> = { itineraryId: id };
    if (targetId && targetId !== "all") {
      query.targetId = targetId;
    }
    if (targetType && targetType !== "all") {
      query.targetType = targetType;
    }

    const comments = await TripComment.find(query).sort({ createdAt: 1 }).lean();

    return NextResponse.json({ success: true, data: comments });
  } catch (error) {
    console.error("GET /api/itineraries/[id]/comments error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/itineraries/[id]/comments
 * Creates a new comment or activity note on an itinerary.
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
      return NextResponse.json(
        { success: false, message: "You must be signed in to add comments" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const itinerary = await RecentItineraryModel.findById(id).lean();
    if (!itinerary) {
      return NextResponse.json(
        { success: false, message: "Itinerary not found" },
        { status: 404 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const parsed = CreateCommentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const user = await UserModel.findById(sessionUserId).lean();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User profile not found" },
        { status: 404 }
      );
    }

    const newComment = await TripComment.create({
      itineraryId: id,
      userId: sessionUserId,
      userName: user.name || user.username || "Traveler",
      userAvatar: (user as any).avatar || (user as any).image || "",
      targetType: parsed.data.targetType,
      targetId: parsed.data.targetId,
      content: parsed.data.content,
      isResolved: false,
    });

    return NextResponse.json(
      { success: true, message: "Comment added", data: newComment },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/itineraries/[id]/comments error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create comment" },
      { status: 500 }
    );
  }
}
