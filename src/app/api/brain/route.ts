import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import TravelBrainEntry from "@/models/TravelBrainEntry.model";
import { getAuthSession, getSessionUserId } from "@/lib/authSession";
import { z } from "zod";

const BrainEntrySchema = z.object({
  title: z.string().min(1, "Title is required"),
  destination: z.string().optional().default(""),
  category: z.enum([
    "hidden_gems",
    "food_etiquette",
    "packing",
    "budget",
    "safety",
    "local_customs",
    "flight_hacks",
    "general",
  ]),
  content: z.string().min(3, "Content must be at least 3 characters"),
  tags: z.array(z.string()).optional().default([]),
  isShared: z.boolean().optional().default(false),
});

/**
 * GET /api/brain
 * Retrieves all personal knowledge entries for the authenticated user.
 * Supports optional ?category= or ?query= filters.
 */
export async function GET(request: Request) {
  await dbConnect();
  try {
    const session = await getAuthSession();
    const sessionUserId = getSessionUserId(session);
    if (!sessionUserId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const query = searchParams.get("query");

    const filter: Record<string, unknown> = { userId: sessionUserId };
    if (category && category !== "all") {
      filter.category = category;
    }
    if (query) {
      const regex = new RegExp(query, "i");
      filter.$or = [
        { title: regex },
        { destination: regex },
        { content: regex },
        { tags: regex },
      ];
    }

    const entries = await TravelBrainEntry.find(filter)
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: entries });
  } catch (error) {
    console.error("GET /api/brain error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch knowledge base entries" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/brain
 * Creates a new personal knowledge entry in the user's Travel Brain.
 */
export async function POST(request: Request) {
  await dbConnect();
  try {
    const session = await getAuthSession();
    const sessionUserId = getSessionUserId(session);
    if (!sessionUserId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = BrainEntrySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const newEntry = await TravelBrainEntry.create({
      userId: sessionUserId,
      ...validation.data,
    });

    return NextResponse.json({ success: true, data: newEntry }, { status: 201 });
  } catch (error) {
    console.error("POST /api/brain error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save knowledge base entry" },
      { status: 500 }
    );
  }
}
