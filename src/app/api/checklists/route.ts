import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import PackingChecklistModel from "@/models/PackingChecklist.model";
import { getAuthSession, getSessionUserId } from "@/lib/authSession";

/**
 * GET /api/checklists
 * Retrieves all packing checklists for the authenticated user.
 */
export async function GET() {
  await dbConnect();
  try {
    const session = await getAuthSession();
    const sessionUserId = getSessionUserId(session);
    if (!sessionUserId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const lists = await PackingChecklistModel.find({ userId: sessionUserId })
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: lists });
  } catch (error) {
    console.error("GET /api/checklists error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch checklists" }, { status: 500 });
  }
}

/**
 * POST /api/checklists
 * Creates or updates a packing checklist.
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
    const { _id, tripName, destination, items } = body;

    if (_id) {
      const updated = await PackingChecklistModel.findOneAndUpdate(
        { _id, userId: sessionUserId },
        {
          tripName: tripName?.trim() || "My Packing List",
          destination: destination?.trim() || "General Trip",
          items: Array.isArray(items) ? items : [],
        },
        { new: true }
      );
      if (!updated) {
        return NextResponse.json({ success: false, message: "Checklist not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: updated, message: "Checklist saved" });
    } else {
      const newList = await PackingChecklistModel.create({
        userId: sessionUserId,
        tripName: tripName?.trim() || "My Packing List",
        destination: destination?.trim() || "General Trip",
        items: Array.isArray(items) ? items : [],
      });
      return NextResponse.json({ success: true, data: newList, message: "Checklist created" });
    }
  } catch (error: any) {
    console.error("POST /api/checklists error:", error);
    const status = error?.name === "ValidationError" ? 400 : 500;
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to save checklist" },
      { status }
    );
  }
}
