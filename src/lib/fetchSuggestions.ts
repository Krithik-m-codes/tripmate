// lib/fetchSuggestions.ts

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
}

export const fetchSuggestions = async (
  query: string
): Promise<Suggestion[]> => {
  const locationAPI = process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY;

  if (!query || !locationAPI) {
    console.warn("Query is empty or API key is missing");
    return [];
  }

  try {
    const response = await fetch(
      `https://us1.locationiq.com/v1/autocomplete.php?key=${locationAPI}&q=${encodeURIComponent(
        query
      )}&limit=10&dedupe=1&format=json`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      // LocationIQ might return an error object instead of an array
      if (data.error) {
        console.error("LocationIQ API error:", data.error);
        return [];
      }
      console.warn("Unexpected API response format:", data);
      return [];
    }

    return data.map((item: any) => ({
      display_name: item.display_name || "",
      lat: item.lat || "",
      lon: item.lon || "",
    }));
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
};
