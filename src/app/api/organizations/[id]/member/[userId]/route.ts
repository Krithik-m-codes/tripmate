import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import OrganizationModel from "@/models/Organization.model";
import UserModel from "@/models/User.model";
import { getAuthSession, getSessionUserId } from "@/lib/authSession";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  await dbConnect();
  try {
    const session = await getAuthSession();
    const sessionUserId = getSessionUserId(session);
    if (!sessionUserId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id, userId } = await params;
    const org = await OrganizationModel.findById(id);
    if (!org) {
      return NextResponse.json({ success: false, message: "Workspace not found" }, { status: 404 });
    }

    // Can remove if sessionUser is owner or self-leaving
    if (org.ownerId.toString() !== sessionUserId && sessionUserId !== userId) {
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    }

    if (org.ownerId.toString() === userId) {
      return NextResponse.json({ success: false, message: "Workspace owner cannot be removed" }, { status: 400 });
    }

    org.members = org.members?.filter((m) => m.userId.toString() !== userId);
    await org.save();

    await UserModel.findByIdAndUpdate(userId, { $pull: { organizations: org._id } });

    return NextResponse.json({ success: true, message: "Member removed from workspace" });
  } catch (error) {
    console.error("DELETE /api/organization/[id]/member/[userId] error:", error);
    return NextResponse.json({ success: false, message: "Failed to remove member" }, { status: 500 });
  }
}
