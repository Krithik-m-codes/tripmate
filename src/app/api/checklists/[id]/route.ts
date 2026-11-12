import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import PackingChecklistModel from "@/models/PackingChecklist.model";
import { getAuthSession, getSessionUserId } from "@/lib/authSession";

/**
 * DELETE /api/checklists/[id]
 * Deletes a packing checklist owned by the user.
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
    const deleted = await PackingChecklistModel.findOneAndDelete({ _id: id, userId: sessionUserId });
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Checklist not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Checklist deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/checklists/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to delete checklist" }, { status: 500 });
  }
}
