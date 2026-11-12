import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import RecentItineraryModel from "@/models/SavedItinerary.model";
import { getAuthSession, getSessionUserId } from "@/lib/authSession";

/**
 * POST /api/itineraries/[id]/share
 *
 * Generates a public shareToken for the itinerary and sets isPublic to true.
 * Returns the shareToken and public shareable URL.
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
    const item = await RecentItineraryModel.findOne({ _id: id, userId: sessionUserId });
    if (!item) {
      return NextResponse.json(
        { success: false, message: "Itinerary not found or unauthorized" },
        { status: 404 }
      );
    }

    // Generate unique shareToken if it doesn't already have one
    if (!item.shareToken) {
      item.shareToken = crypto.randomBytes(6).toString("hex"); // 12 char clean hex token
    }
    item.isPublic = true;
    await item.save();

    return NextResponse.json({
      success: true,
      shareToken: item.shareToken,
      isPublic: item.isPublic,
    });
  } catch (error) {
    console.error("POST /api/itineraries/[id]/share error:", error);
    return NextResponse.json({ success: false, message: "Failed to create share link" }, { status: 500 });
  }
}

/**
 * DELETE /api/itineraries/[id]/share
 *
 * Revokes public access by setting isPublic to false.
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
    const item = await RecentItineraryModel.findOne({ _id: id, userId: sessionUserId });
    if (!item) {
      return NextResponse.json(
        { success: false, message: "Itinerary not found or unauthorized" },
        { status: 404 }
      );
    }

    item.isPublic = false;
    await item.save();

    return NextResponse.json({
      success: true,
      message: "Public access revoked",
      isPublic: false,
    });
  } catch (error) {
    console.error("DELETE /api/itineraries/[id]/share error:", error);
    return NextResponse.json({ success: false, message: "Failed to revoke share link" }, { status: 500 });
  }
}
