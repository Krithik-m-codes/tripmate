import fetch from "node-fetch";

const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

interface WeatherResponse {
  // Define the shape of the weather response here
  [key: string]: any;
}

// Define the function to get the weather data
export async function getWeather(
  lat: number,
  lon: number
): Promise<WeatherResponse> {
  const url = `${WEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error fetching weather data: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}
