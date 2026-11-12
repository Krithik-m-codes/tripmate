import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";
import { signUpSchema } from "@/schemas/signUpSchema";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { name, email, username, avatar } = await request.json();
    const parsed = signUpSchema.safeParse({ name, username, email });
    if (!parsed.success) {
      return Response.json(
        {
          success: false,
          message: parsed.error.errors[0]?.message || "Invalid sign-up data",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = parsed.data.email.toLowerCase();
    const normalizedUsername = parsed.data.username;
    const normalizedName = parsed.data.name;

    const existingUserVerifiedByUsername = await UserModel.findOne({
      username: normalizedUsername,
      isVerified: true,
    });
    if (existingUserVerifiedByUsername) {
      return Response.json({ success: false, message: "Username already taken" }, { status: 400 });
    }

    const existingUserByEmail = await UserModel.findOne({
      email: normalizedEmail,
    });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verifyCodeExpires = new Date(Date.now() + 3_600_000); // 1 hour

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          { success: false, message: "An account with this email already exists" },
          { status: 400 }
        );
      }
      existingUserByEmail.verifyCode = verifyCode;
      existingUserByEmail.verifyCodeExpires = verifyCodeExpires;
      await existingUserByEmail.save();
    } else {
      await new UserModel({
        username: normalizedUsername,
        name: normalizedName,
        email: normalizedEmail,
        password: "",
        avatar,
        verifyCode,
        verifyCodeExpires,
        isVerified: false,
        plan: "free",
        planStatus: "active",
        planProvider: null,
        planStartedAt: new Date(),
        usage: {
          periodStart: new Date(),
          itineraryGenerations: 0,
          geocodeRequests: 0,
        },
        searchHistory: [],
        savedPlaces: [],
      }).save();
    }

    // Send verification email server-side — verifyCode never leaves the server
    const origin = new URL(request.url).origin;
    const verifyUrl = `${origin}/verify-email?username=${encodeURIComponent(normalizedUsername)}`;
    const emailResult = await sendVerificationEmail(
      normalizedEmail,
      normalizedName || normalizedUsername,
      verifyCode,
      {
        ctaUrl: verifyUrl,
        ctaLabel: "Verify my account",
      }
    );
    if (!emailResult.success) {
      console.error("Verification email failed:", emailResult.message);
      // Still return success; user can request a resend from verify-email page
    }

    return Response.json(
      {
        success: true,
        message: "Account created! Please check your email to verify your address.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Sign-up error:", error);
    return Response.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
