export const fetchTravelData = async (
  type: string,
  lat: number,
  lon: number
) => {
  const apiKey = process.env.NEXT_PUBLIC_RAPIDAPI_API_KEY;

  console.log(`Fetching ${type} data for lat: ${lat}, lon: ${lon}`);

  if (!apiKey) {
    console.error("Error: No API key found");
    return [];
  }

  const url = `https://travel-advisor.p.rapidapi.com/${type}/list-by-latlng?latitude=${lat}&longitude=${lon}`;
  console.log(`API URL: ${url}`);

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
    },
  };

  try {
    console.log("Sending API request...");
    const response = await fetch(url, options);
    console.log(`Response status: ${response.status}`);

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Data received in fetchTravelData:", data);

    if (!data.data || data.data.length === 0) {
      console.log("No results found in the response");
      return [];
    }

    return data.data;
  } catch (error) {
    console.error("Error in fetchTravelData:", error);
    return [];
  }
};
