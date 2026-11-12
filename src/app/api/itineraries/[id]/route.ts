import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import RecentItineraryModel from "@/models/SavedItinerary.model";
import { getAuthSession, getSessionUserId } from "@/lib/authSession";

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
    const item = await RecentItineraryModel.findById(id).lean();
    if (!item) {
      return NextResponse.json({ success: false, message: "Itinerary not found" }, { status: 404 });
    }

    // Verify access (owner, public, or org member)
    if (item.userId.toString() !== sessionUserId && !item.isPublic && !item.organizationId) {
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("GET /api/itinerary/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to retrieve itinerary" }, { status: 500 });
  }
}

export async function PUT(
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
    const item = await RecentItineraryModel.findOne({ _id: id, userId: sessionUserId });
    if (!item) {
      return NextResponse.json(
        { success: false, message: "Itinerary not found or unauthorized" },
        { status: 404 }
      );
    }

    if (body.destination !== undefined) item.destination = body.destination.trim();
    if (body.activities !== undefined) item.activities = body.activities;
    if (body.budget !== undefined) item.budget = body.budget;
    if (body.travelStyle !== undefined) item.travelStyle = body.travelStyle;
    if (body.itinerary !== undefined) item.itinerary = body.itinerary;
    if (body.isPublic !== undefined) item.isPublic = body.isPublic;
    if (body.tags !== undefined) item.tags = body.tags;
    if (body.rating !== undefined) item.rating = body.rating;
    if (body.notes !== undefined) item.notes = body.notes;
    if (body.organizationId !== undefined) item.organizationId = body.organizationId || undefined;

    await item.save();
    return NextResponse.json({ success: true, message: "Itinerary updated", data: item });
  } catch (error) {
    console.error("PUT /api/itinerary/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to update itinerary" }, { status: 500 });
  }
}

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
    const result = await RecentItineraryModel.findOneAndDelete({ _id: id, userId: sessionUserId });
    if (!result) {
      return NextResponse.json(
        { success: false, message: "Itinerary not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Itinerary deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/itinerary/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to delete itinerary" }, { status: 500 });
  }
}
