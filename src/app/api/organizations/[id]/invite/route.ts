import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import OrganizationModel from "@/models/Organization.model";
import UserModel from "@/models/User.model";
import { getAuthSession, getSessionUserId } from "@/lib/authSession";

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
    const { email, role = "editor" } = await request.json();

    if (!email || !email.trim()) {
      return NextResponse.json({ success: false, message: "Member email is required" }, { status: 400 });
    }

    const org = await OrganizationModel.findById(id);
    if (!org) {
      return NextResponse.json({ success: false, message: "Workspace not found" }, { status: 404 });
    }

    // Must be owner or editor to invite
    const inviter = org.members?.find((m) => m.userId.toString() === sessionUserId);
    if (org.ownerId.toString() !== sessionUserId && inviter?.role !== "owner" && inviter?.role !== "editor") {
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    }

    const targetUser = await UserModel.findOne({ email: email.trim().toLowerCase() });
    if (!targetUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found on Tripmate yet. We sent an invitation link to their email.",
        },
        { status: 404 }
      );
    }

    const alreadyMember = org.members?.some((m) => m.userId.toString() === targetUser._id.toString());
    if (alreadyMember) {
      return NextResponse.json({ success: false, message: "User is already a member" }, { status: 400 });
    }

    org.members.push({
      userId: targetUser._id as any,
      role: role === "viewer" ? "viewer" : "editor",
      joinedAt: new Date(),
    });
    await org.save();

    targetUser.organizations = targetUser.organizations || [];
    targetUser.organizations.push(org._id as any);
    await targetUser.save();

    return NextResponse.json({ success: true, message: "Member added to workspace", data: org });
  } catch (error) {
    console.error("POST /api/organization/[id]/invite error:", error);
    return NextResponse.json({ success: false, message: "Failed to invite member" }, { status: 500 });
  }
}
