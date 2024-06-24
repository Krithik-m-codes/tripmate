import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";

// sign in route handler function  POST /api/sign-in
export async function POST(request: Request) {
  await dbConnect();
  try {
    // Destructure the request body to get the email and password
    const { email, password } = await request.json();

    // Check if the email already exists in the database
    const existingUser = await UserModel.findOne({ email });
    console.log("Existing user : ", existingUser);
    if (!existingUser) {
      return Response.json(
        {
          success: false,
          message: "Email not found",
        },
        {
          status: 400,
        }
      );
    }

    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return Response.json(
        {
          success: false,
          message: "Invalid password",
        },
        {
          status: 400,
        }
      );
    }

    // Send verification email to the user with the verification code if the user is not verified yet and email is not null and password is correct
    if (!existingUser.isVerified && existingUser.email) {
      const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
      existingUser.verifyCode = verifyCode;
      existingUser.verifyCodeExpires = new Date();
      await existingUser.save();
      await sendVerificationEmail(
        existingUser.email,
        existingUser.username,
        verifyCode
      );
    } else {
      console.log("User is already verified");
    }

    // return a success response if the sign in is successful
    return Response.json(
      {
        success: true,
        message: "Sign in successful",
        isVerified: existingUser.isVerified,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error signing in : ", error);
    return Response.json(
      {
        success: false,
        message: "Error signing in",
      },
      {
        status: 500,
      }
    );
  }
}
