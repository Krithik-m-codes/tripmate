import dbConnect from "@/lib/dbConnect";
import SavedPlaces from "@/models/SavedPlace.model";

export async function GET(request: Request) {
  await dbConnect();
  try {
    const userId = request.url.split("/").pop();
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
