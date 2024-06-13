import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { z } from "zod";
import { userNameValidation } from "@/schemas/signUpSchema";

// check username unique route handler function POST /api/check-username-unique
const UsernameQuerySchema = z.object({
  username: userNameValidation,
});

// check username unique route handler function POST /api/check-username-unique
export async function GET(request: Request) {
  await dbConnect();
  try {
    // Destructure the request body to get the username from the query string parameters
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    //validate with zod
    const result = UsernameQuerySchema.safeParse(queryParam);
    // console.log(result); // { success: true, data: { name: 'John Doe' } }
    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameError?.length > 0
              ? usernameError.join(", ")
              : "Invalid Query Parameters [Username]",
          //   errors: usernameError,
        },
        {
          status: 400,
        }
      );
    }
    // check if username is unique in database
    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username already exists",
        },
        {
          status: 400,
        }
      );
    }
    // return response if username is unique
    return Response.json(
      {
        success: true,
        message: "Username is unique",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error checking if username is unique : ", error);
    return Response.json(
      {
        success: false,
        message: "Error checking if username is unique",
      },
      {
        status: 500,
      }
    );
  }
}
