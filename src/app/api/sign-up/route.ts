import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs";

// import { upload } from "../../../middlewares/multer.middleware";
// import { uploadOnCloudinary } from "@/utils/cloudinary.service";

// sign up route handler function  POST /api/sign-up
export async function POST(request: Request) {
  await dbConnect();
  try {
    // Destructure the request body to get the name, email, password, username, and avatar
    const { name, email, password, username, avatar } = await request.json();

    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerifiedByUsername) {
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
    // //email to lowercase to check if it's existing or not
    // const dummy = email.z.string().toLowerCase()
    // console.log("check email : " , dummy)

    // Check if the email already exists in the database
    const existingUserByEmail = await UserModel.findOne({ email });
    // Generate a random 6 digit verification code
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with this email !",
          },
          {
            status: 400,
          }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpires = new Date(
          Date.now() + 3600000 * 24 * 7
        ); // 7 days expiry;
        await existingUserByEmail.save();
      }
    } else {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      // Set the expiry date to 1 hour from the current date
      expiryDate.setHours(expiryDate.getHours() + 1);

      // Create a new user
      const newUser = new UserModel({
        username,
        name,
        email,
        password: hashedPassword,
        avatar,
        verifyCode: verifyCode,
        verifyCodeExpires: expiryDate,
        isVerified: false,
        searchHistory: [],
        savedPlaces: [],
      });
      // Save the user to the database
      await newUser.save();
    }

    // Return a success response
    return Response.json(
      {
        success: true,
        message: "User registered successfully . Please verify your email !",
        verifyCode: verifyCode,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
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
