const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

interface WeatherResponse {
  main: {
    temp: number;
    feels_like: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  name: string;
  sys: {
    country: string;
  };
  [key: string]: any;
}

// Convert WMO Weather interpretation codes (WW) to human readable descriptions & icon names
function getWeatherDescriptionAndIcon(code: number): { description: string; icon: string } {
  if (code === 0) return { description: "Clear sky", icon: "01d" };
  if (code === 1 || code === 2 || code === 3) return { description: "Partly cloudy", icon: "02d" };
  if (code >= 45 && code <= 48) return { description: "Foggy", icon: "50d" };
  if (code >= 51 && code <= 57) return { description: "Drizzle", icon: "09d" };
  if (code >= 61 && code <= 67) return { description: "Rain", icon: "10d" };
  if (code >= 71 && code <= 77) return { description: "Snow", icon: "13d" };
  if (code >= 80 && code <= 82) return { description: "Rain showers", icon: "09d" };
  if (code >= 95 && code <= 99) return { description: "Thunderstorm", icon: "11d" };
  return { description: "Fair conditions", icon: "02d" };
}

export async function getWeather(lat: number, lon: number): Promise<WeatherResponse> {
  const url = `${OPEN_METEO_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "Tripmate/1.0 (https://tripmate.vercel.app)",
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching weather data: ${response.statusText}`);
  }

  const data = await response.json();
  const current = data.current || {};
  const weatherCode = current.weather_code ?? 0;
  const { description, icon } = getWeatherDescriptionAndIcon(weatherCode);

  return {
    main: {
      temp: current.temperature_2m ?? 22,
      feels_like: current.apparent_temperature ?? 22,
    },
    weather: [
      {
        description,
        icon,
      },
    ],
    wind: {
      speed: current.wind_speed_10m ?? 3.5,
    },
    name: "Local Area",
    sys: {
      country: "",
    },
    raw: data,
  };
}
