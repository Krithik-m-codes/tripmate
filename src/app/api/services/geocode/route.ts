import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { getAuthSession, getSessionUserId } from "@/lib/authSession";
import { ensureMonthlyUsageWindow } from "@/lib/planUsage";
import { getPlanLimits, isLimitExceeded } from "@/lib/plan";

export async function GET(request: Request) {
  await dbConnect();
  try {
    const session = await getAuthSession();
    const sessionUserId = getSessionUserId(session);
    if (!sessionUserId) {
      return Response.json({ success: false, message: "User not authorized" }, { status: 401 });
    }

    const user = await UserModel.findById(sessionUserId).exec();
    if (!user) {
      return Response.json({ success: false, message: "User not found" }, { status: 404 });
    }

    ensureMonthlyUsageWindow(user);
    const limits = getPlanLimits(user.plan);
    const geocodeCount = user.usage?.geocodeRequests ?? 0;
    if (isLimitExceeded(geocodeCount, limits.geocodeRequestsPerMonth)) {
      return Response.json(
        {
          success: false,
          message: "Geocoding limit reached for your monthly plan window. Upgrade to Pro for unlimited searches.",
        },
        { status: 402 }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();
    if (!query) {
      return Response.json({ success: false, message: "Query is required" }, { status: 400 });
    }

    // 100% Open-Source Geocoding using Photon Komoot & OpenStreetMap Nominatim (No API keys required)
    let suggestions: Array<{
      id: string;
      name: string;
      place_name: string;
      center: [number, number];
    }> = [];

    try {
      const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`;
      const response = await fetch(photonUrl, {
        headers: {
          "User-Agent": "Tripmate/1.0 (https://tripmate.vercel.app)",
        },
      });

      if (response.ok) {
        const data = await response.json();
        suggestions = (data.features || []).map((feature: any) => {
          const props = feature.properties || {};
          const coords = feature.geometry?.coordinates || [0, 0];
          const parts = [props.name, props.city || props.town || props.village, props.state, props.country].filter(Boolean);
          const placeName = parts.join(", ") || props.name || "Unknown Location";

          return {
            id: String(props.osm_id || Math.random().toString(36).substring(2)),
            name: props.name || placeName,
            place_name: placeName,
            center: [parseFloat(coords[0]), parseFloat(coords[1])], // [lon, lat]
          };
        });
      }
    } catch (photonError) {
      console.warn("Photon geocode failed, falling back to Nominatim:", photonError);
    }

    // Fallback to Nominatim if Photon returned 0 results or failed
    if (suggestions.length === 0) {
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`;
      const response = await fetch(nominatimUrl, {
        headers: {
          "User-Agent": "Tripmate/1.0 (https://tripmate.vercel.app)",
          "Accept-Language": "en",
        },
      });
      if (response.ok) {
        const data = await response.json();
        suggestions = (data || []).map((item: any) => ({
          id: String(item.place_id),
          name: item.display_name?.split(",")[0] || item.display_name,
          place_name: item.display_name,
          center: [parseFloat(item.lon), parseFloat(item.lat)],
        }));
      }
    }

    user.usage = user.usage ?? {
      periodStart: new Date(),
      itineraryGenerations: 0,
      geocodeRequests: 0,
    };
    user.usage.geocodeRequests = (user.usage.geocodeRequests ?? 0) + 1;
    await user.save();

    return Response.json({ success: true, data: suggestions }, { status: 200 });
  } catch (error) {
    console.error("Geocode error:", error);
    return Response.json(
      { success: false, message: "Failed to fetch geocoding results" },
      { status: 500 }
    );
  }
}
