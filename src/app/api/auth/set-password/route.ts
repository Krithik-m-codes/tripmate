import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ message: "Username and password are required." }, { status: 400 });
    }
    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ username });
    if (!user) {
      return NextResponse.json({ message: "Account not found." }, { status: 404 });
    }
    if (!user.isVerified) {
      return NextResponse.json(
        { message: "Email not verified. Please verify your email first." },
        { status: 403 }
      );
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    return NextResponse.json({ message: "Password set successfully. You can now sign in." });
  } catch {
    return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
  }
}
