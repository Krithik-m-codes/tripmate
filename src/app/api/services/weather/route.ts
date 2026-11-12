import { getWeather } from "@/lib/weatherService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    // console.log("searchParams : ", searchParams);
    const lat = Number(searchParams.get("lat"));
    const lon = Number(searchParams.get("lon"));

    const weather = await getWeather(lat, lon);

    return Response.json(
      {
        success: true,
        message: "Weather report retrieved successfully",
        data: weather,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error getting weather report : ", error);
    return Response.json(
      {
        success: false,
        message: "Error getting weather report",
      },
      {
        status: 500,
      }
    );
  }
}
