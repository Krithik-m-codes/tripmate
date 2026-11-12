import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { sendPasswordResetEmail } from "@/utils/sendPasswordResetEmail";

const RESET_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { email } = await request.json();
    if (!email || typeof email !== "string") {
      return Response.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await UserModel.findOne({ email: normalizedEmail });

    if (!user) {
      return Response.json(
        {
          success: true,
          message: "If that email is registered, a reset link is on its way.",
        },
        { status: 200 }
      );
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
    await user.save();

    const origin = new URL(request.url).origin;
    const resetUrl = `${origin}/reset-password?token=${resetToken}`;
    const emailResult = await sendPasswordResetEmail(
      user.email,
      user.name || user.username,
      resetUrl
    );

    if (!emailResult.success) {
      console.error("Password reset email failed:", emailResult.message);
    }

    return Response.json(
      {
        success: true,
        message: "If that email is registered, a reset link is on its way.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return Response.json(
      { success: false, message: "Failed to process password reset" },
      { status: 500 }
    );
  }
}
