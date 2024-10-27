import dbConnect from "@/lib/dbConnect";
import RecentItineraryModel from "@/models/SavedItinerary.model";
import UserModel from "@/models/User.model";

// add search history route handler function POST /api/itinerary/add
export async function POST(request: Request) {
  await dbConnect();
  try {
    const { userId, itinerary , destination , days , activities , budget , travelStyle } = await request.json();
    // console.log(userId, search);
    const user = await UserModel.findById(userId).exec();
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

    // create a new recent itinerary
    const newSavedItinerary = new RecentItineraryModel({
      userId,
      itinerary,
      destination,
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
