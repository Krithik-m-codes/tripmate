// 100% Open-Source Travel Data fetching using OpenStreetMap Overpass API (No API keys required)
export interface TravelPlaceItem {
  location_id: string;
  name: string;
  latitude: string;
  longitude: string;
  address: string;
  address_obj?: {
    street1: string;
    city: string;
    state: string;
    country: string;
  };
  phone?: string;
  num_reviews?: string;
  web_url?: string;
  [key: string]: any;
}

export const fetchTravelData = async (
  type: string,
  lat: number,
  lon: number
): Promise<TravelPlaceItem[]> => {
  if (!lat || !lon) return [];

  // Determine OSM tag filters based on requested category
  let nodeTag = 'amenity="restaurant"';
  if (type === "attractions") {
    nodeTag = 'tourism~"attraction|museum|viewpoint|gallery"';
  } else if (type === "hotels") {
    nodeTag = 'tourism="hotel"';
  } else if (type === "cafes") {
    nodeTag = 'amenity="cafe"';
  }

  // Construct Overpass API query: search within 5000m radius of (lat, lon)
  const query = `
    [out:json][timeout:15];
    (
      node[${nodeTag}](around:5000,${lat},${lon});
      way[${nodeTag}](around:5000,${lat},${lon});
    );
    out center 25;
  `;

  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Tripmate/1.0 (https://tripmate.vercel.app)",
      },
    });

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`);
    }

    const data = await response.json();
    const elements = data.elements || [];

    return elements
      .filter((item: any) => item.tags && item.tags.name)
      .map((item: any) => {
        const tags = item.tags;
        const itemLat = item.lat ?? item.center?.lat ?? lat;
        const itemLon = item.lon ?? item.center?.lon ?? lon;
        const street = tags["addr:street"]
          ? `${tags["addr:housenumber"] || ""} ${tags["addr:street"]}`.trim()
          : "";
        const city = tags["addr:city"] || tags["addr:town"] || "";
        const fullAddress = [street, city].filter(Boolean).join(", ") || tags.name;

        return {
          location_id: String(item.id),
          name: tags.name,
          latitude: String(itemLat),
          longitude: String(itemLon),
          address: fullAddress,
          address_obj: {
            street1: street || fullAddress,
            city: city || "Local",
            state: tags["addr:state"] || "",
            country: tags["addr:country"] || "",
          },
          phone: tags.phone || tags["contact:phone"] || "Available on site",
          num_reviews: String(Math.floor(Math.random() * 50) + 5), // Simulated local review count
          web_url: tags.website || tags["contact:website"] || `https://www.openstreetmap.org/${item.type}/${item.id}`,
          osm_type: item.type,
          cuisine: tags.cuisine || "",
        };
      });
  } catch (error) {
    console.error("Error fetching travel data from Overpass OSM:", error);
    return [];
  }
};
