#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  geocodePlace,
  getDirections,
  getWeather,
  searchPlaces,
} from "./lib/travel.mjs";
import { planTrip } from "./lib/plan.mjs";

const VERSION = "0.1.0";

const server = new McpServer({
  name: "tripmate",
  version: VERSION,
});

const json = (data) => ({
  content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
});

const fail = (error) => ({
  isError: true,
  content: [
    {
      type: "text",
      text: error instanceof Error ? error.message : String(error),
    },
  ],
});

server.registerTool(
  "geocode_place",
  {
    title: "Geocode a place",
    description:
      "Resolve a city, address, or landmark to latitude/longitude using OpenStreetMap Nominatim. Use this before weather, places, or routing calls.",
    inputSchema: {
      query: z.string().min(1).describe("City, address, or landmark, e.g. 'Lisbon, Portugal'"),
      limit: z.number().int().min(1).max(8).default(3).describe("Maximum matches to return"),
    },
    annotations: { readOnlyHint: true, openWorldHint: true },
  },
  async ({ query, limit }) => {
    try {
      return json(await geocodePlace(query, limit));
    } catch (error) {
      return fail(error);
    }
  }
);

server.registerTool(
  "search_places",
  {
    title: "Search nearby places",
    description:
      "Find attractions, restaurants, cafes, hotels, or nightlife within a radius using OpenStreetMap Overpass. Returns names, coordinates, addresses, websites, and opening hours when tagged.",
    inputSchema: {
      latitude: z.number().min(-90).max(90).describe("Latitude"),
      longitude: z.number().min(-180).max(180).describe("Longitude"),
      category: z
        .enum(["attractions", "food", "cafes", "hotels", "nightlife"])
        .default("attractions")
        .describe("Place category"),
      radius_km: z.number().min(0.5).max(15).default(5).describe("Search radius in kilometres"),
      limit: z.number().int().min(1).max(30).default(12).describe("Maximum places to return"),
    },
    annotations: { readOnlyHint: true, openWorldHint: true },
  },
  async ({ latitude, longitude, category, radius_km, limit }) => {
    try {
      return json(
        await searchPlaces({
          latitude,
          longitude,
          category,
          radiusKm: radius_km,
          limit,
        })
      );
    } catch (error) {
      return fail(error);
    }
  }
);

server.registerTool(
  "get_weather",
  {
    title: "Get a daily weather forecast",
    description:
      "Get a daily forecast from Open-Meteo for a coordinate. No API key required. Supports up to 16 days ahead; further dates return a note instead of a forecast.",
    inputSchema: {
      latitude: z.number().min(-90).max(90).describe("Latitude"),
      longitude: z.number().min(-180).max(180).describe("Longitude"),
      days: z.number().int().min(1).max(16).default(7).describe("Forecast window"),
      start_date: z.string().optional().describe("Optional YYYY-MM-DD filter"),
      end_date: z.string().optional().describe("Optional YYYY-MM-DD filter"),
    },
    annotations: { readOnlyHint: true, openWorldHint: true },
  },
  async ({ latitude, longitude, days, start_date, end_date }) => {
    try {
      return json(
        await getWeather({
          latitude,
          longitude,
          days,
          startDate: start_date,
          endDate: end_date,
        })
      );
    } catch (error) {
      return fail(error);
    }
  }
);

server.registerTool(
  "get_directions",
  {
    title: "Get a driving route",
    description:
      "Geocode two places and return driving distance and duration from the public OSRM demo server. Driving only; not a transit or walking route.",
    inputSchema: {
      from: z.string().min(1).describe("Starting place"),
      to: z.string().min(1).describe("Destination place"),
    },
    annotations: { readOnlyHint: true, openWorldHint: true },
  },
  async ({ from, to }) => {
    try {
      return json(await getDirections({ from, to }));
    } catch (error) {
      return fail(error);
    }
  }
);

server.registerTool(
  "plan_trip",
  {
    title: "Plan a trip",
    description:
      "Build a structured day-by-day itinerary. Geocodes the destination, fetches live weather and nearby places, then asks Gemini for a schema-validated plan. Requires GEMINI_API_KEY.",
    inputSchema: {
      destination: z.string().min(1).describe("City or region, e.g. 'Lisbon, Portugal'"),
      start_date: z.string().describe("Start date, YYYY-MM-DD"),
      end_date: z.string().describe("End date, YYYY-MM-DD (max 21 days)"),
      budget_level: z
        .enum(["budget", "mid-range", "luxury"])
        .default("mid-range")
        .describe("Spending level"),
      travel_style: z
        .string()
        .default("mixed")
        .describe("e.g. food, culture, outdoors, nightlife, mixed"),
      preferences: z.string().default("").describe("Free-text preferences"),
      travelers: z.number().int().min(1).max(20).default(1).describe("Number of travellers"),
      model: z
        .string()
        .optional()
        .describe("Optional Gemini model override, e.g. gemini-1.5-flash"),
    },
    annotations: { readOnlyHint: true, openWorldHint: true },
  },
  async (args) => {
    try {
      return json(
        await planTrip({
          destination: args.destination,
          startDate: args.start_date,
          endDate: args.end_date,
          budgetLevel: args.budget_level,
          travelStyle: args.travel_style,
          preferences: args.preferences,
          travelers: args.travelers,
          model: args.model,
        })
      );
    } catch (error) {
      return fail(error);
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error(`tripmate-mcp v${VERSION} running on stdio`);
