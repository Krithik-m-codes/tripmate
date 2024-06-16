import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

// get user profile route handler function POST /api/profile
export async function GET(request: Request) {
  await dbConnect();
  try {
    // get user session
    const session = await getServerSession(authOptions);
    console.log("Session : ", session);
    if (!session || !session?.user) {
      return Response.json(
        {
          success: false,
          message: "User not authorized",
        },
        { status: 401 }
      );
    }

    // get user data from database and return it
    const user: User = session?.user as User;
    const userData = await UserModel.findById(session?.user?._id).exec();
    console.log("User : ", user);
    console.log("User data : ", userData);

    if (!userData || !user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User profile",
        data: userData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting user profile : ", error);
    return Response.json(
      {
        success: false,
        message: "Error getting user profile",
      },
      { status: 500 }
    );
  }
}
