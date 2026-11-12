// lib/fetchSuggestions.ts

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
}

export const fetchSuggestions = async (query: string): Promise<Suggestion[]> => {
  if (!query) {
    return [];
  }

  try {
    const response = await fetch(`/api/services/geocode?q=${encodeURIComponent(query)}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success || !Array.isArray(data.data)) {
      return [];
    }

    return data.data.map((item: any) => ({
      display_name: item.place_name || item.name || item.display_name || "",
      lat: String(item.center?.[1] ?? item.lat ?? ""),
      lon: String(item.center?.[0] ?? item.lon ?? ""),
    }));
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
};
