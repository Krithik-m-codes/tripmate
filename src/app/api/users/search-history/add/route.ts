import dbConnect from "@/lib/dbConnect";
import SearchHistory from "@/models/SearchHistory.model";
import UserModel from "@/models/User.model";
import { getAuthSession, getSessionUserId } from "@/lib/authSession";
import { getPlanLimits, isLimitExceeded } from "@/lib/plan";

// add search history route handler function POST /api/search-history/add
export async function POST(request: Request) {
  await dbConnect();
  try {
    const session = await getAuthSession();
    const sessionUserId = getSessionUserId(session);
    if (!sessionUserId) {
      return Response.json({ success: false, message: "User not authorized" }, { status: 401 });
    }

    const { search } = await request.json();
    const trimmedSearch = typeof search === "string" ? search.trim() : "";
    if (!trimmedSearch) {
      return Response.json({ success: false, message: "Search term is required" }, { status: 400 });
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
    const historyCount = await SearchHistory.countDocuments({ userId: sessionUserId });
    if (isLimitExceeded(historyCount, limits.searchHistory)) {
      return Response.json(
        {
          success: false,
          message: "Search history limit reached. Upgrade to Pro for more.",
        },
        { status: 402 }
      );
    }

    // create search history entry
    const newSearchHistory = new SearchHistory({
      userId: sessionUserId,
      search: trimmedSearch,
    });
    const savedSearchHistory = await newSearchHistory.save();

    // update user's search history
    user.searchHistory.push(savedSearchHistory);
    await user.save();

    return Response.json(
      {
        success: true,
        message: "Search history added successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error adding search history:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to add search history",
      },
      {
        status: 500,
      }
    );
  }
}
