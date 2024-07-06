// lib/fetchSuggestions.ts
export const fetchSuggestions = async (query: string) => {
  // Fetch suggestions from location IQ API
  const locationAPI = process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY;
  if (!query) return [];
  try {
    const response = await fetch(
      `https://us1.locationiq.com/v1/autocomplete.php?key=${locationAPI}&q=${query}&limit=10&dedupe=1&format=json`
    );
    const data = await response.json();

    return data?.map((item: any) => ({
      display_name: item.display_name,
      lat: item.lat,
      lon: item.lon,
    }));
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
};
