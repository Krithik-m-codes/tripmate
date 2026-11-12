import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import TripComment from "@/models/TripComment.model";
import RecentItineraryModel from "@/models/SavedItinerary.model";
import { getAuthSession, getSessionUserId } from "@/lib/authSession";
import { z } from "zod";

const UpdateCommentSchema = z.object({
  content: z.string().min(1).optional(),
  isResolved: z.boolean().optional(),
});

/**
 * PATCH /api/itineraries/[id]/comments/[commentId]
 * Updates comment content or toggles resolved status.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  await dbConnect();
  try {
    const session = await getAuthSession();
    const sessionUserId = getSessionUserId(session);
    if (!sessionUserId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id, commentId } = await params;
    const comment = await TripComment.findOne({ _id: commentId, itineraryId: id });
    if (!comment) {
      return NextResponse.json({ success: false, message: "Comment not found" }, { status: 404 });
    }

    const itinerary = await RecentItineraryModel.findById(id).lean();
    const isItineraryOwner = itinerary?.userId?.toString() === sessionUserId;
    const isCommentAuthor = comment.userId?.toString() === sessionUserId;

    if (!isItineraryOwner && !isCommentAuthor) {
      return NextResponse.json(
        { success: false, message: "Only the comment author or itinerary owner can modify this comment" },
        { status: 403 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = UpdateCommentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    if (parsed.data.content !== undefined && isCommentAuthor) {
      comment.content = parsed.data.content;
    }
    if (parsed.data.isResolved !== undefined) {
      comment.isResolved = parsed.data.isResolved;
    }

    await comment.save();

    return NextResponse.json({ success: true, message: "Comment updated", data: comment });
  } catch (error) {
    console.error("PATCH /api/itineraries/[id]/comments/[commentId] error:", error);
    return NextResponse.json({ success: false, message: "Failed to update comment" }, { status: 500 });
  }
}

/**
 * DELETE /api/itineraries/[id]/comments/[commentId]
 * Deletes a comment. Author or itinerary owner can delete.
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  await dbConnect();
  try {
    const session = await getAuthSession();
    const sessionUserId = getSessionUserId(session);
    if (!sessionUserId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id, commentId } = await params;
    const comment = await TripComment.findOne({ _id: commentId, itineraryId: id });
    if (!comment) {
      return NextResponse.json({ success: false, message: "Comment not found" }, { status: 404 });
    }

    const itinerary = await RecentItineraryModel.findById(id).lean();
    const isItineraryOwner = itinerary?.userId?.toString() === sessionUserId;
    const isCommentAuthor = comment.userId?.toString() === sessionUserId;

    if (!isItineraryOwner && !isCommentAuthor) {
      return NextResponse.json(
        { success: false, message: "Only the comment author or itinerary owner can delete this comment" },
        { status: 403 }
      );
    }

    await TripComment.deleteOne({ _id: commentId });

    return NextResponse.json({ success: true, message: "Comment deleted" });
  } catch (error) {
    console.error("DELETE /api/itineraries/[id]/comments/[commentId] error:", error);
    return NextResponse.json({ success: false, message: "Failed to delete comment" }, { status: 500 });
  }
}
