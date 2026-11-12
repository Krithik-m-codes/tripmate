import { fetchTravelData } from "@/lib/fetchTravelData";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = Number(searchParams.get("lat"));
    const lon = Number(searchParams.get("lon"));
    const type = searchParams.get("type") || "restaurants";

    if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
      return Response.json(
        { success: false, message: "Valid lat and lon query parameters are required" },
        { status: 400 }
      );
    }

    const places = await fetchTravelData(type, lat, lon);

    return Response.json(
      {
        success: true,
        message: "Places retrieved successfully from OpenStreetMap Overpass",
        data: places,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting places:", error);
    return Response.json(
      { success: false, message: "Error getting places data" },
      { status: 500 }
    );
  }
}
