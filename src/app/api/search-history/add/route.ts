import dbConnect from "@/lib/dbConnect";
import SearchHistory from "@/models/SearchHistory.model";
import UserModel from "@/models/User.model";

// add search history route handler function POST /api/search-history/add
export async function POST(request: Request) {
  await dbConnect();
  try {
    const { userId, search } = await request.json();
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

    // create search history entry
    const newSearchHistory = new SearchHistory({
      userId,
      search,
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
