// src/app/api/search-history/[userId]/route.ts
import dbConnect from "@/lib/dbConnect";
import RecentItineraryModel from "@/models/SavedItinerary.model";

// get search history route handler function GET /api/search-history/[userId]
export async function GET(request: Request) {
  await dbConnect();
  try {
    const userId = request.url.split("/").pop();
    const recentItinerary = await RecentItineraryModel.find({ userId }).sort({
      createdAt: -1,
    });

    if (!recentItinerary || recentItinerary.length === 0) {
      return Response.json(
        {
          success: false,
          message: "Search history not found",
        },
        {
          status: 404,
        }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Recent Ai trips retrieved successfully",
        data: recentItinerary,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error retrieving itineraries :", error);
    return Response.json(
      {
        success: false,
        message: "Error retrieving itineraries",
      },
      {
        status: 400,
      }
    );
  }
}
