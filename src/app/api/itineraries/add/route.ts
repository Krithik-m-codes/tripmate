import dbConnect from "@/lib/dbConnect";
import RecentItineraryModel from "@/models/SavedItinerary.model";
import UserModel from "@/models/User.model";
import { getAuthSession, getSessionUserId } from "@/lib/authSession";
import { getPlanLimits, isLimitExceeded } from "@/lib/plan";

// add search history route handler function POST /api/itinerary/add
export async function POST(request: Request) {
  await dbConnect();
  try {
    const session = await getAuthSession();
    const sessionUserId = getSessionUserId(session);
    if (!sessionUserId) {
      return Response.json({ success: false, message: "User not authorized" }, { status: 401 });
    }

    const { itinerary, destination, days, activities, budget, travelStyle } = await request.json();
    const trimmedDestination = typeof destination === "string" ? destination.trim() : "";
    if (!trimmedDestination || !days?.from || !days?.to || !budget || !travelStyle) {
      return Response.json(
        {
          success: false,
          message: "Destination, dates, budget, and travel style are required",
        },
        { status: 400 }
      );
    }

    const user = await UserModel.findById(sessionUserId).exec();
    // console.log(user);
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
    const itineraryCount = await RecentItineraryModel.countDocuments({
      userId: sessionUserId,
    });
    if (isLimitExceeded(itineraryCount, limits.savedItineraries)) {
      return Response.json(
        {
          success: false,
          message: "Saved itineraries limit reached. Upgrade to Pro for more.",
        },
        { status: 402 }
      );
    }

    // create a new recent itinerary
    const newSavedItinerary = new RecentItineraryModel({
      userId: sessionUserId,
      itinerary,
      destination: trimmedDestination,
      days,
      activities,
      budget,
      travelStyle,
    });

    // save the new saved itinerary
    const SavedItinerary = await newSavedItinerary.save();

    // add the saved itinerary to the user's saved itineraries
    user.savedItineraries.push(SavedItinerary);

    await user.save();

    return Response.json(
      {
        success: true,
        message: "Recent Itinerary added successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error adding recent itinerary :", error);
    return Response.json(
      {
        success: false,
        message: "Failed to add recent travel itinerary",
      },
      {
        status: 500,
      }
    );
  }
}
