import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import SavedPlacesModel from "@/models/SavedPlace.model";
import { getAuthSession, getSessionUserId } from "@/lib/authSession";

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
    const place = await SavedPlacesModel.findOne({ _id: id, userId: sessionUserId });
    if (!place) {
      return NextResponse.json(
        { success: false, message: "Saved place not found or access denied" },
        { status: 404 }
      );
    }

    if (body.name !== undefined) place.name = body.name.trim();
    if (body.location !== undefined) place.location = body.location.trim();
    if (body.description !== undefined) place.description = body.description.trim();
    if (body.category !== undefined) place.category = body.category;
    if (body.rating !== undefined) place.rating = body.rating;
    if (body.notes !== undefined) place.notes = body.notes;
    if (body.coordinates !== undefined) place.coordinates = body.coordinates;
    if (body.organizationId !== undefined) place.organizationId = body.organizationId || undefined;

    await place.save();
    return NextResponse.json({ success: true, message: "Saved place updated", data: place });
  } catch (error) {
    console.error("PUT /api/saved-places/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to update saved place" }, { status: 500 });
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
    const result = await SavedPlacesModel.findOneAndDelete({ _id: id, userId: sessionUserId });
    if (!result) {
      return NextResponse.json(
        { success: false, message: "Saved place not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Saved place deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/saved-places/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to delete saved place" }, { status: 500 });
  }
}
