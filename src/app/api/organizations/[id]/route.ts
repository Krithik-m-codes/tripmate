import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import OrganizationModel from "@/models/Organization.model";
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
    const org = await OrganizationModel.findById(id).lean();
    if (!org) {
      return NextResponse.json({ success: false, message: "Workspace not found" }, { status: 404 });
    }

    const isMember =
      org.ownerId.toString() === sessionUserId ||
      org.members?.some((m) => m.userId.toString() === sessionUserId);

    if (!isMember) {
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: org });
  } catch (error) {
    console.error("GET /api/organization/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch workspace" }, { status: 500 });
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
    const { name } = await request.json();
    const org = await OrganizationModel.findById(id);
    if (!org || org.ownerId.toString() !== sessionUserId) {
      return NextResponse.json(
        { success: false, message: "Workspace not found or access denied" },
        { status: 403 }
      );
    }

    if (name && name.trim()) {
      org.name = name.trim();
      await org.save();
    }

    return NextResponse.json({ success: true, message: "Workspace updated", data: org });
  } catch (error) {
    console.error("PUT /api/organization/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to update workspace" }, { status: 500 });
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
    const org = await OrganizationModel.findById(id);
    if (!org || org.ownerId.toString() !== sessionUserId) {
      return NextResponse.json(
        { success: false, message: "Workspace not found or access denied (owner only)" },
        { status: 403 }
      );
    }

    await OrganizationModel.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Workspace deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/organization/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to delete workspace" }, { status: 500 });
  }
}
