import dbConnect from "@/lib/dbConnect";
import SavedPlaces from "@/models/SavedPlace.model";
import UserModel from "@/models/User.model";
export async function POST(request: Request) {
  await dbConnect();
  try {
    // get user id, name, location, description from request body and find user in database
    const { userId, name, location, description } = await request.json();
    const user = await UserModel.findById(userId).exec();

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // create new place object and save it to database
    const newSavedPlace = new SavedPlaces({
      userId,
      name,
      location,
      description,
    });
    // save place to database
    const savedSavedPlace = await newSavedPlace.save();
    // update user's saved places array with new place added
    user.savedPlaces.push(savedSavedPlace);
    await user.save();

    return Response.json(
      {
        success: true,
        message: "Place saved added successfully",
        data: savedSavedPlace,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error saving place : ", error);
    return Response.json(
      {
        success: false,
        message: "Couldn't save place , something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}
