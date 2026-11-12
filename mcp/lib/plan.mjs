import { geocodePlace, getWeather, searchPlaces } from "./travel.mjs";

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

const ITINERARY_SCHEMA = {
  type: "OBJECT",
  properties: {
    summary: { type: "STRING" },
    days: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          day: { type: "INTEGER" },
          date: { type: "STRING" },
          theme: { type: "STRING" },
          activities: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                timeSlot: {
                  type: "STRING",
                  enum: ["morning", "afternoon", "evening"],
                },
                title: { type: "STRING" },
                description: { type: "STRING" },
                place: { type: "STRING" },
                category: {
                  type: "STRING",
                  enum: [
                    "sightseeing",
                    "food",
                    "transport",
                    "accommodation",
                    "activity",
                    "shopping",
                    "nightlife",
                  ],
                },
                estimatedCostUsd: { type: "NUMBER" },
                tip: { type: "STRING" },
              },
              required: [
                "timeSlot",
                "title",
                "description",
                "category",
                "estimatedCostUsd",
              ],
            },
          },
          dailyCostUsd: { type: "NUMBER" },
        },
        required: ["day", "date", "theme", "activities", "dailyCostUsd"],
      },
    },
    totalEstimatedCostUsd: { type: "NUMBER" },
    packingTips: { type: "ARRAY", items: { type: "STRING" } },
    culturalNotes: { type: "ARRAY", items: { type: "STRING" } },
  },
  required: [
    "summary",
    "days",
    "totalEstimatedCostUsd",
    "packingTips",
    "culturalNotes",
  ],
};

const SYSTEM_PROMPT = `You are TripMate's planning engine.

Rules:
- Build a practical day-by-day plan using the supplied live data.
- Prefer named places from the supplied places list. Do not invent places, opening hours, or prices.
- Costs must be labelled as planning estimates in USD, not live quotes.
- Use morning, afternoon, and evening slots. Three activities per day is enough.
- Respect the weather forecast. Move outdoor activities away from heavy rain.
- Keep descriptions specific and short enough to scan on a phone.
- Return JSON only, matching the provided schema.`;

function dateRange(startDate, endDate) {
  const start = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate}T00:00:00Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new Error("start_date and end_date must be YYYY-MM-DD dates");
  }
  if (end < start) {
    throw new Error("end_date must be on or after start_date");
  }

  const days = [];
  for (let cursor = start; cursor <= end; cursor = new Date(cursor.getTime() + 86_400_000)) {
    days.push(cursor.toISOString().slice(0, 10));
    if (days.length > 21) {
      throw new Error("Trips longer than 21 days are not supported by plan_trip");
    }
  }
  return days;
}

function buildPrompt({ destination, dates, budgetLevel, travelStyle, preferences, travelers, weather, places }) {
  const weatherText =
    weather.days.length > 0
      ? weather.days
          .map(
            (day) =>
              `${day.date}: ${day.condition}, ${day.minC}–${day.maxC}°C, ${day.precipitationChance ?? "?"}% rain`
          )
          .join("\n")
      : weather.note || "No forecast available. Use seasonal norms and say so.";

  return `Plan a ${dates.length}-day trip.

Destination: ${destination}
Dates: ${dates[0]} to ${dates[dates.length - 1]}
Travelers: ${travelers}
Budget level: ${budgetLevel}
Travel style: ${travelStyle}
Preferences: ${preferences || "General sightseeing, local food, cultural experiences"}

Live weather forecast:
${weatherText}

Nearby places from OpenStreetMap:
${JSON.stringify(places, null, 2)}

Return one entry per date in the dates list, in order.`;
}

async function callGemini({ prompt, model, apiKey }) {
  const response = await fetch(
    `${GEMINI_BASE}/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 8192,
          responseMimeType: "application/json",
          responseSchema: ITINERARY_SCHEMA,
        },
      }),
      signal: AbortSignal.timeout(60_000),
    }
  );

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data?.error?.message || `Gemini request failed with HTTP ${response.status}`;
    throw new Error(message);
  }

  const text = data?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();

  if (!text) {
    const blockReason = data?.promptFeedback?.blockReason;
    throw new Error(
      blockReason
        ? `Gemini blocked the request (${blockReason})`
        : "Gemini returned an empty response"
    );
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Gemini returned invalid JSON");
  }
}

/**
 * High-level tool: geocode the destination, gather live weather and places,
 * then ask Gemini for a structured itinerary constrained to that data.
 */
export async function planTrip({
  destination,
  startDate,
  endDate,
  budgetLevel = "mid-range",
  travelStyle = "mixed",
  preferences = "",
  travelers = 1,
  model,
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not set. Add it to the MCP server environment to use plan_trip. " +
        "Geocoding, places, weather, and directions work without a key."
    );
  }

  const dates = dateRange(startDate, endDate);
  const matches = await geocodePlace(destination, 1);
  const place = matches[0];

  const [weather, attractions, food] = await Promise.all([
    getWeather({
      latitude: place.latitude,
      longitude: place.longitude,
      days: Math.min(dates.length, 16),
      startDate,
      endDate,
    }).catch((error) => ({ days: [], note: `Forecast unavailable: ${error.message}` })),
    searchPlaces({
      latitude: place.latitude,
      longitude: place.longitude,
      category: "attractions",
      radiusKm: 8,
      limit: 14,
    }).catch(() => []),
    searchPlaces({
      latitude: place.latitude,
      longitude: place.longitude,
      category: "food",
      radiusKm: 5,
      limit: 12,
    }).catch(() => []),
  ]);

  const places = [...attractions.slice(0, 10), ...food.slice(0, 8)];
  const resolvedModel = model || process.env.GEMINI_MODEL || "gemini-1.5-flash";

  const itinerary = await callGemini({
    prompt: buildPrompt({
      destination: place.name,
      dates,
      budgetLevel,
      travelStyle,
      preferences,
      travelers,
      weather,
      places,
    }),
    model: resolvedModel,
    apiKey,
  });

  return {
    destination: place.name,
    coordinates: { latitude: place.latitude, longitude: place.longitude },
    dates: { startDate: dates[0], endDate: dates[dates.length - 1], days: dates.length },
    weather,
    places,
    itinerary,
    model: resolvedModel,
    sources: [
      "OpenStreetMap Nominatim (geocoding)",
      "OpenStreetMap Overpass (places)",
      "Open-Meteo (weather)",
      "Google Gemini (planning)",
    ],
    disclaimer:
      "Costs are AI planning estimates, not live prices. Confirm opening hours, tickets, and bookings with the venue.",
  };
}
