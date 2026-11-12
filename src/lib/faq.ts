export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

/**
 * Answers are written to be quoted. The first sentence of each answer is a
 * direct response under 40 words, so AI answer engines can extract it cleanly.
 */
export const FAQS: FaqItem[] = [
  {
    id: "free",
    question: "Is TripMate free?",
    answer:
      "Yes. The free tier includes 10 AI itinerary generations per month, 25 saved places, and 10 saved itineraries, with no credit card required. Pro removes those limits.",
  },
  {
    id: "claude-desktop",
    question: "Does TripMate work with Claude Desktop?",
    answer:
      "Yes. TripMate ships an MCP server that runs over stdio, so Claude Desktop, Cursor, and Claude Code can call its travel tools directly. Add the server to your MCP config and set GEMINI_API_KEY for itinerary generation.",
  },
  {
    id: "self-host",
    question: "Can I self-host TripMate?",
    answer:
      "Yes. TripMate is MIT-licensed and runs on Node.js 20+ with MongoDB. Clone the repo, set the environment variables, run pnpm install and pnpm dev, then point your MCP client at mcp/server.mjs.",
  },
  {
    id: "vs-chatgpt",
    question: "How is TripMate different from ChatGPT travel planning?",
    answer:
      "TripMate returns a structured, editable itinerary validated against a schema, not a chat transcript. It pulls live place, weather, and routing data through MCP tools, and you can self-host the entire stack.",
  },
  {
    id: "data",
    question: "What live data does TripMate use?",
    answer:
      "TripMate uses OpenStreetMap Nominatim for geocoding and place search, Open-Meteo for weather, and OSRM for driving routes. Costs are AI planning estimates, not live flight or hotel prices.",
  },
  {
    id: "open-source",
    question: "Is TripMate open source?",
    answer:
      "Yes. The source is public on GitHub under the MIT license, so you can inspect, modify, and redistribute it. The MCP server and web app live in the same repository.",
  },
  {
    id: "booking",
    question: "Does TripMate book flights or hotels?",
    answer:
      "No. TripMate plans and estimates; it does not book flights, hotels, or activities. It can suggest booking links, but you confirm availability and prices with the provider.",
  },
];
