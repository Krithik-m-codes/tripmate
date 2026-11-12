import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { message: "This endpoint is deprecated. Use Better Auth client.emailOtp.sendVerificationOtp instead." },
    { status: 410 }
  );
}
