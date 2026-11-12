import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import RecentItineraryModel from "@/models/SavedItinerary.model";

/**
 * GET /api/itineraries/public/[shareToken]
 *
 * Retrieves a public itinerary by its unique shareToken.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ shareToken: string }> }
) {
  await dbConnect();
  try {
    const { shareToken } = await params;
    const item = await RecentItineraryModel.findOne({
      shareToken,
      isPublic: true,
    }).lean();

    if (!item) {
      return NextResponse.json(
        { success: false, message: "Shared itinerary not found or is no longer public" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("GET /api/itineraries/public/[shareToken] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load shared itinerary" },
      { status: 500 }
    );
  }
}
