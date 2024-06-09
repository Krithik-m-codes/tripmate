import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

// sign in route handler function  POST /api/sign-in
export async function POST(request: Request) {
  await dbConnect();
  try {
    const { email, password } = await request.json();
    const user = await UserModel.findOne({
      email,
    });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User with this email does not exist",
        },
        {
          status: 404,
        }
      );
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return Response.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        {
          status: 401,
        }
      );
    }
    return Response.json(
      {
        success: true,
        message: "User logged in successfully",
        data: user,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in sign-in route: ", error);
    return Response.json(
      {
        success: false,
        message: "Error logging in User , Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}
