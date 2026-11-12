import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
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

    const user = await UserModel.findById(sessionUserId)
      .select("-password -loginOtp -loginOtpExpires -verifyCode -verifyCodeExpires")
      .lean();

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("GET /api/user/profile error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  await dbConnect();
  try {
    const session = await getAuthSession();
    const sessionUserId = getSessionUserId(session);
    if (!sessionUserId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const user = await UserModel.findById(sessionUserId);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    if (body.name !== undefined) user.name = body.name.trim();
    if (body.avatar !== undefined) user.avatar = body.avatar.trim();
    if (body.username !== undefined) user.username = body.username.trim();
    if (body.preferences !== undefined) (user as any).preferences = body.preferences;

    await user.save();

    const cleanUser = user.toObject() as any;
    delete cleanUser.password;
    delete cleanUser.loginOtp;
    delete cleanUser.verifyCode;

    return NextResponse.json({ success: true, message: "Profile updated successfully", data: cleanUser });
  } catch (error) {
    console.error("PUT /api/user/profile error:", error);
    return NextResponse.json({ success: false, message: "Failed to update profile" }, { status: 500 });
  }
}
