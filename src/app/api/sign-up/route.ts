import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

function verificationCode() {
  return Math.floor(100000 + Math.random() * 900000);
}

// sign up route handler function  POST /api/sign-up
export async function POST(request: Request) {
  await dbConnect();
  try {
    // Destructure the request body to get the name, email, password, username, and avatar
    const { name, email, password, username, avatar } = await request.json();
    const existingUser = await UserModel.findOne({
      email,
    });
    // Check if the user already exists
    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: "User with this email already exists",
        },
        {
          status: 400,
        }
      );
    }
    
    const verifyCode = verificationCode().toString();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new UserModel({
      name,
      email,
      password: hashedPassword,
      username,
      avatar,
      verifyCode,
      verifyCodeExpires: new Date(Date.now() + 600000),
      searchHistory: [],
    });
    await user.save();
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    return Response.json(
      {
        success: true,
        message: "User registered successfully",
        data: emailResponse,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error in sign-up route: ", error);
    return Response.json(
      {
        success: false,
        message: "Error registering User , Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}

