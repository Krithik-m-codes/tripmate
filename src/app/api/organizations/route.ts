import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import OrganizationModel from "@/models/Organization.model";
import UserModel from "@/models/User.model";
import { getAuthSession, getSessionUserId } from "@/lib/authSession";

export async function GET() {
  await dbConnect();
  try {
    const session = await getAuthSession();
    const sessionUserId = getSessionUserId(session);
    if (!sessionUserId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const organizations = await OrganizationModel.find({
      $or: [{ ownerId: sessionUserId }, { "members.userId": sessionUserId }],
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: organizations });
  } catch (error) {
    console.error("GET /api/organization error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch organizations" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const session = await getAuthSession();
    const sessionUserId = getSessionUserId(session);
    if (!sessionUserId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { name } = await request.json();
    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, message: "Organization name is required" }, { status: 400 });
    }

    const baseSlug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const slugSuffix = Math.floor(1000 + Math.random() * 9000);
    const slug = `${baseSlug}-${slugSuffix}`;

    const newOrg = await OrganizationModel.create({
      name: name.trim(),
      slug,
      ownerId: sessionUserId,
      members: [{ userId: sessionUserId, role: "owner", joinedAt: new Date() }],
    });

    const user = await UserModel.findById(sessionUserId);
    if (user) {
      user.organizations = user.organizations || [];
      user.organizations.push(newOrg._id as any);
      await user.save();
    }

    return NextResponse.json({ success: true, message: "Workspace created", data: newOrg }, { status: 201 });
  } catch (error) {
    console.error("POST /api/organization error:", error);
    return NextResponse.json({ success: false, message: "Failed to create workspace" }, { status: 500 });
  }
}
