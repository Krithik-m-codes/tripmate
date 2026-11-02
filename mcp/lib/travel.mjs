import { fetchJson, nominatimThrottle } from "./http.mjs";

const NOMINATIM = "https://nominatim.openstreetmap.org";
const OPEN_METEO = "https://api.open-meteo.com/v1/forecast";
const OSRM = "https://router.project-osrm.org";

/** Nominatim special phrases used for category search. */
const PLACE_QUERIES = {
  attractions: "attraction",
  food: "restaurant",
  cafes: "cafe",
  hotels: "hotel",
  nightlife: "bar",
};

/** WMO weather interpretation codes used by Open-Meteo. */
const WEATHER_CODES = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

export function weatherLabel(code) {
  return WEATHER_CODES[code] ?? `Unknown weather code ${code}`;
}

/**
 * Resolve a city, address, or landmark to coordinates.
 */
export async function geocodePlace(query, limit = 3) {
  await nominatimThrottle();
  const url = new URL("/search", NOMINATIM);
  url.searchParams.set("q", query);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("addressdetails", "1");

  const results = await fetchJson(url);
  if (!Array.isArray(results) || results.length === 0) {
    throw new Error(`No coordinates found for "${query}"`);
  }

  return results.map((item) => ({
    name: item.display_name,
    latitude: Number(item.lat),
    longitude: Number(item.lon),
    type: item.type,
    category: item.category,
    countryCode: item.address?.country_code?.toUpperCase(),
  }));
}

/**
 * Find nearby places with OpenStreetMap Nominatim.
 * Nominatim is fast and key-free; Overpass was too slow for a tool call
 * on the public instance. Both return the same OpenStreetMap data.
 */
export async function searchPlaces({
  latitude,
  longitude,
  category = "attractions",
  radiusKm = 5,
  limit = 12,
}) {
  const phrase = PLACE_QUERIES[category];
  if (!phrase) {
    throw new Error(
      `Unsupported category "${category}". Use one of: ${Object.keys(PLACE_QUERIES).join(", ")}`
    );
  }

  const radius = Math.min(Math.max(radiusKm, 0.5), 15);
  const dLat = radius / 111.32;
  const dLon = radius / (111.32 * Math.cos((latitude * Math.PI) / 180) || 1);

  await nominatimThrottle();
  const url = new URL("/search", NOMINATIM);
  url.searchParams.set("q", phrase);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", String(Math.min(Math.max(limit, 1), 30)));
  url.searchParams.set("bounded", "1");
  url.searchParams.set(
    "viewbox",
    [longitude - dLon, latitude - dLat, longitude + dLon, latitude + dLat].join(",")
  );
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("extratags", "1");

  const data = await fetchJson(url);
  const elements = Array.isArray(data) ? data : [];

  return elements
    .filter((item) => item.name && item.lat && item.lon)
    .map((item) => ({
      name: item.name,
      category,
      osmType: item.type || null,
      latitude: Number(item.lat),
      longitude: Number(item.lon),
      address: item.display_name || null,
      website: item.extratags?.website || item.extratags?.["contact:website"] || null,
      openingHours: item.extratags?.opening_hours || null,
      cuisine: item.extratags?.cuisine || null,
      source: "OpenStreetMap / Nominatim",
    }));
}

/**
 * Daily forecast from Open-Meteo. No API key required.
 * The forecast endpoint supports up to 16 days ahead.
 */
export async function getWeather({ latitude, longitude, days = 7, startDate, endDate }) {
  const forecastDays = Math.min(Math.max(days, 1), 16);
  const url = new URL(OPEN_METEO);
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set(
    "daily",
    "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max"
  );
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", String(forecastDays));

  const data = await fetchJson(url);
  const daily = data.daily;
  if (!daily?.time) {
    throw new Error("Open-Meteo returned no daily forecast");
  }

  const rows = daily.time.map((date, index) => ({
    date,
    condition: weatherLabel(daily.weather_code?.[index]),
    weatherCode: daily.weather_code?.[index] ?? null,
    maxC: daily.temperature_2m_max?.[index] ?? null,
    minC: daily.temperature_2m_min?.[index] ?? null,
    precipitationChance: daily.precipitation_probability_max?.[index] ?? null,
  }));

  const filtered =
    startDate || endDate
      ? rows.filter(
          (row) =>
            (!startDate || row.date >= startDate) && (!endDate || row.date <= endDate)
        )
      : rows;

  return {
    timezone: data.timezone,
    days: filtered,
    note:
      filtered.length === 0
        ? "The trip dates are outside the 16-day forecast window. Use seasonal norms instead."
        : undefined,
    source: "Open-Meteo",
  };
}

/**
 * Driving route between two places. Uses the public OSRM demo server.
 */
export async function getDirections({ from, to }) {
  const [origin, destination] = await Promise.all([
    geocodePlace(from, 1),
    geocodePlace(to, 1),
  ]);
  const start = origin[0];
  const end = destination[0];

  const url = `${OSRM}/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=false&steps=false`;
  const data = await fetchJson(url);

  if (data.code !== "Ok" || !data.routes?.length) {
    throw new Error(`No driving route found (OSRM code: ${data.code || "unknown"})`);
  }

  const route = data.routes[0];
  return {
    from: start.name,
    to: end.name,
    distanceKm: Number((route.distance / 1000).toFixed(1)),
    durationMinutes: Math.round(route.duration / 60),
    mode: "driving",
    source: "OSRM public demo server",
    note: "Public demo server. Check OSRM's usage policy before production traffic.",
  };
}
