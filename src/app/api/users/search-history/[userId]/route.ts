// src/app/api/search-history/[userId]/route.ts
import dbConnect from "@/lib/dbConnect";
import SearchHistory from "@/models/SearchHistory.model";
import { getAuthSession, getSessionUserId } from "@/lib/authSession";

// get search history route handler function GET /api/search-history/[userId]
export async function GET(request: Request) {
  await dbConnect();
  try {
    const session = await getAuthSession();
    const sessionUserId = getSessionUserId(session);
    if (!sessionUserId) {
      return Response.json({ success: false, message: "User not authorized" }, { status: 401 });
    }

    const userId = request.url.split("/").pop();
    if (!userId || userId !== sessionUserId) {
      return Response.json({ success: false, message: "Access denied" }, { status: 403 });
    }
    const searchHistory = await SearchHistory.find({ userId }).sort({
      createdAt: -1,
    });

    if (!searchHistory || searchHistory.length === 0) {
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
        message: "Search history retrieved successfully",
        data: searchHistory,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error retrieving search history:", error);
    return Response.json(
      {
        success: false,
        message: "Error retrieving search history",
      },
      {
        status: 400,
      }
    );
  }
}
