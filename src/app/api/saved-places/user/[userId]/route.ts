import dbConnect from "@/lib/dbConnect";
import SavedPlaces from "@/models/SavedPlace.model";
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
    const savedPlaces = await SavedPlaces.find({ userId }).exec();

    if (!savedPlaces || savedPlaces.length === 0) {
      return Response.json(
        {
          success: false,
          message: "Saved places not found",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Saved places retrieved successfully",
        data: savedPlaces,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error getting saved places : ", error);
    return Response.json(
      {
        success: false,
        message: "Error getting saved places",
      },
      {
        status: 500,
      }
    );
  }
}
