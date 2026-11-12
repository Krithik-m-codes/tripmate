import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const { username } = await req.json();
    if (!username) {
      return NextResponse.json({ message: "Username is required." }, { status: 400 });
    }

    const user = await UserModel.findOne({ username });
    if (!user) {
      return NextResponse.json({ message: "No account found." }, { status: 404 });
    }
    if (user.isVerified) {
      return NextResponse.json({ message: "Email is already verified." }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verifyCode = otp;
    user.verifyCodeExpires = new Date(Date.now() + 3_600_000);
    await user.save();

    await sendVerificationEmail(user.email, user.name, otp);
    return NextResponse.json({ message: "Verification code resent." });
  } catch {
    return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
  }
}
