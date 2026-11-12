import dbConnect from "@/lib/dbConnect";
import SavedPlaces from "@/models/SavedPlace.model";
import UserModel from "@/models/User.model";
import { getAuthSession, getSessionUserId } from "@/lib/authSession";
import { getPlanLimits, isLimitExceeded } from "@/lib/plan";
export async function POST(request: Request) {
  await dbConnect();
  try {
    const session = await getAuthSession();
    const sessionUserId = getSessionUserId(session);
    if (!sessionUserId) {
      return Response.json({ success: false, message: "User not authorized" }, { status: 401 });
    }

    const { name, location, description } = await request.json();
    const trimmedName = typeof name === "string" ? name.trim() : "";
    const trimmedLocation = typeof location === "string" ? location.trim() : "";
    const trimmedDescription = typeof description === "string" ? description.trim() : "";
    if (!trimmedName || !trimmedLocation || !trimmedDescription) {
      return Response.json(
        { success: false, message: "Name, location, and description are required" },
        { status: 400 }
      );
    }

    const user = await UserModel.findById(sessionUserId).exec();

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

    const limits = getPlanLimits(user.plan);
    const savedCount = await SavedPlaces.countDocuments({ userId: sessionUserId });
    if (isLimitExceeded(savedCount, limits.savedPlaces)) {
      return Response.json(
        {
          success: false,
          message: "Saved places limit reached. Upgrade to Pro for more.",
        },
        { status: 402 }
      );
    }

    // create new place object and save it to database
    const newSavedPlace = new SavedPlaces({
      userId: sessionUserId,
      name: trimmedName,
      location: trimmedLocation,
      description: trimmedDescription,
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
