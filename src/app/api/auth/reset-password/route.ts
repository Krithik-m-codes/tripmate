import crypto from "crypto";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { token, password } = await request.json();
    if (!token || typeof token !== "string") {
      return Response.json({ success: false, message: "Reset token is required" }, { status: 400 });
    }
    if (!password || typeof password !== "string" || password.length < 6) {
      return Response.json(
        { success: false, message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const user = await UserModel.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return Response.json(
        { success: false, message: "Reset link is invalid or expired" },
        { status: 400 }
      );
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return Response.json({ success: true, message: "Password reset successful" }, { status: 200 });
  } catch (error) {
    console.error("Reset password error:", error);
    return Response.json({ success: false, message: "Failed to reset password" }, { status: 500 });
  }
}
