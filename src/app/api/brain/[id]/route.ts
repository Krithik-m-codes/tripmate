import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import TravelBrainEntry from "@/models/TravelBrainEntry.model";
import { getAuthSession, getSessionUserId } from "@/lib/authSession";
import { z } from "zod";

const UpdateBrainEntrySchema = z.object({
  title: z.string().min(1).optional(),
  destination: z.string().optional(),
  category: z
    .enum([
      "hidden_gems",
      "food_etiquette",
      "packing",
      "budget",
      "safety",
      "local_customs",
      "flight_hacks",
      "general",
    ])
    .optional(),
  content: z.string().min(3).optional(),
  tags: z.array(z.string()).optional(),
  isShared: z.boolean().optional(),
});

/**
 * GET /api/brain/[id]
 * Retrieves a specific personal knowledge entry by ID.
 */
export async function GET(
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
    const entry = await TravelBrainEntry.findOne({ _id: id, userId: sessionUserId }).lean();
    if (!entry) {
      return NextResponse.json({ success: false, message: "Entry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: entry });
  } catch (error) {
    console.error("GET /api/brain/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to retrieve entry" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/brain/[id]
 * Updates a specific personal knowledge entry.
 */
export async function PATCH(
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
    const body = await request.json();
    const validation = UpdateBrainEntrySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const updatedEntry = await TravelBrainEntry.findOneAndUpdate(
      { _id: id, userId: sessionUserId },
      { $set: validation.data },
      { new: true }
    ).lean();

    if (!updatedEntry) {
      return NextResponse.json({ success: false, message: "Entry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedEntry });
  } catch (error) {
    console.error("PATCH /api/brain/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update entry" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/brain/[id]
 * Deletes a specific personal knowledge entry.
 */
export async function DELETE(
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
    const deleted = await TravelBrainEntry.findOneAndDelete({ _id: id, userId: sessionUserId });
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Entry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Entry deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/brain/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete entry" },
      { status: 500 }
    );
  }
}
