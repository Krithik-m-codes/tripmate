import dbConnect from "@/lib/dbConnect";
import RecentItineraryModel from "@/models/SavedItinerary.model";
import { getAuthSession, getSessionUserId } from "@/lib/authSession";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  await dbConnect();
  try {
    const session = await getAuthSession();
    const sessionUserId = getSessionUserId(session);
    if (!sessionUserId) {
      return Response.json({ success: false, message: "User not authorized" }, { status: 401 });
    }

    const { userId } = await params;
    if (!userId || userId !== sessionUserId) {
      return Response.json({ success: false, message: "Access denied" }, { status: 403 });
    }
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
