# TripMate MCP server

A Model Context Protocol server that exposes TripMate's travel tools to any
MCP client: Claude Desktop, Cursor, Claude Code, or your own agent.

It runs over **stdio** and needs no hosting. Four of the five tools are
key-free; only itinerary generation needs a Gemini API key.

## Requirements

- Node.js 20 or newer
- `GEMINI_API_KEY` — optional, only for the `plan_trip` tool

## Install

```bash
cd mcp
npm install
```

Verify the server before wiring it into a client:

```bash
npm run check   # syntax check
npm run smoke   # starts the server, lists tools, calls the public APIs
```

## Tools

| Tool | What it does | Key required |
| --- | --- | --- |
| `geocode_place` | Resolve a city, address, or landmark to coordinates (OpenStreetMap Nominatim). | No |
| `search_places` | Find attractions, restaurants, cafes, hotels, or nightlife within a radius, using OpenStreetMap data. | No |
| `get_weather` | Daily forecast for a coordinate, up to 16 days ahead (Open-Meteo). | No |
| `get_directions` | Driving distance and duration between two places (OSRM). | No |
| `plan_trip` | Geocode, fetch live weather and nearby places, then return a schema-validated day-by-day itinerary (Google Gemini). | Yes |

All tools are read-only. Costs returned by `plan_trip` are planning
estimates, not live quotes. Opening hours and availability should be
confirmed with the venue.

## Configure Claude Desktop

Add the server to your Claude Desktop config:

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "tripmate": {
      "command": "node",
      "args": ["/absolute/path/to/tripmate/mcp/server.mjs"],
      "env": {
        "GEMINI_API_KEY": "your-key-here"
      }
    }
  }
}
```

Restart Claude Desktop. You should see `tripmate` listed with five tools. If
`plan_trip` is not needed, omit `GEMINI_API_KEY`; the other tools still work.

## Configure Cursor

Create `.cursor/mcp.json` in your project, or add the same block to the global
Cursor MCP settings:

```json
{
  "mcpServers": {
    "tripmate": {
      "command": "node",
      "args": ["/absolute/path/to/tripmate/mcp/server.mjs"],
      "env": { "GEMINI_API_KEY": "your-key-here" }
    }
  }
}
```

## Configure Claude Code

```bash
claude mcp add tripmate -- node /absolute/path/to/tripmate/mcp/server.mjs
```

To pass the API key for the current shell:

```bash
GEMINI_API_KEY=your-key-here claude
```

## Try it

Once the server is connected, ask your client:

> Plan a 5-day trip to Lisbon in mid-November for two people. Mid-range
> budget, food-first, one day trip outside the city.

The agent will call `geocode_place`, `get_weather`, and `search_places`, then
`plan_trip`. You can also call the tools directly:

> Find four viewpoints near 38.7223, -9.1393 within 3 km.
> What is the driving time from Lisbon to Sintra?

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | For `plan_trip` | Google AI Studio key. |
| `GEMINI_MODEL` | No | Override the model, default `gemini-1.5-flash`. |
| `TRIPMATE_USER_AGENT` | No | Contact string sent to Nominatim. Set this if you deploy your own instance. |

Copy `.env.example` as a starting point. The server reads variables from the
process environment, not from a `.env` file, so your MCP client must pass them
through its `env` block.

## Data sources and limits

- **Nominatim** — geocoding and category search. Public instance is rate
  limited to about one request per second; the server serialises calls.
- **Open-Meteo** — forecasts. Free, no key, up to 16 days ahead.
- **OSRM demo server** — driving routes only. Check OSRM's usage policy before
  production traffic.
- **Gemini** — planning. Long trips (over 21 days) are rejected.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Client shows no tools | Use an absolute path to `server.mjs` and restart the client. |
| `plan_trip` returns a `GEMINI_API_KEY` error | Add the key to the client's `env` block. |
| Geocoding returns nothing | Try a more specific query, e.g. `Lisbon, Portugal` instead of `Lisbon`. |
| Weather is missing for your dates | The trip is outside the 16-day forecast window; use seasonal norms. |

## License

MIT. See the repository root `LICENSE`.
