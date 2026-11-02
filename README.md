# TripMate

Open-source, MCP-native trip planning. TripMate is a Next.js web app **and** a
Model Context Protocol server, so Claude Desktop, Cursor, and Claude Code can
call real travel tools and return a structured, editable itinerary.

- **Web app** — generate day-by-day itineraries, save places, explore maps,
  check weather, and keep trip history in one workspace.
- **MCP server** — five tools for geocoding, place search, weather, driving
  routes, and itinerary generation. Four of them need no API key.
- **MIT licensed** — inspect it, self-host it, change it.

Live site: <https://tripmate.xride-labs.in>
MCP docs: [`mcp/README.md`](mcp/README.md)

---

## Features

- **AI trip planner** — structured itineraries validated against a Zod schema,
  with Gemini, NVIDIA NIM, and OpenRouter providers.
- **MCP tools** — `geocode_place`, `search_places`, `get_weather`,
  `get_directions`, and `plan_trip`.
- **Live data, not guesses** — OpenStreetMap Nominatim for geocoding and places,
  Open-Meteo for forecasts, OSRM for driving routes.
- **Interactive maps** — Mapbox-powered search and a saved-places layer.
- **Share and export** — public itinerary links and PDF export.
- **Passwordless auth** — email OTP with optional password, via better-auth.
- **Itinerary history** — re-open any previously generated trip.
- **Self-hostable** — Node.js 20+ and MongoDB. No hosted dependency required.

TripMate does **not** book flights, hotels, or activities, and the costs it
shows are AI planning estimates rather than live prices.

---

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4 + `tw-animate-css` |
| UI primitives | Radix UI / shadcn/ui (`src/components/ui`) |
| Maps | Mapbox GL JS / `react-map-gl`, MapLibre |
| Backend | Next.js route handlers |
| Database | MongoDB via Mongoose |
| Auth | better-auth (email OTP + password) |
| AI | Gemini, NVIDIA NIM, OpenRouter |
| MCP | `@modelcontextprotocol/sdk`, stdio transport |
| Email | React Email + Brevo |
| Media | Cloudinary |

---

## MCP server

The server lives in [`mcp/`](mcp/) and is a standalone package.

```bash
cd mcp
npm install
npm run smoke   # starts the server, lists tools, calls the public APIs
```

Claude Desktop, add this to `claude_desktop_config.json`:

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

Claude Code:

```bash
claude mcp add tripmate -- node /absolute/path/to/tripmate/mcp/server.mjs
```

`GEMINI_API_KEY` is only needed for `plan_trip`. Full setup, Cursor config, and
troubleshooting are in [`mcp/README.md`](mcp/README.md).

---

## Local setup

Requirements: Node.js 20+, pnpm 9+, and a MongoDB connection string.

```bash
pnpm install
cp .env.example .env
pnpm dev
```

The app runs at <http://localhost:3001>.

### Key environment variables

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string |
| `BETTER_AUTH_SECRET` / `NEXTAUTH_SECRET` | Session signing key |
| `BETTER_AUTH_URL` | Public app URL, e.g. `http://localhost:3001` |
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | Mapbox GL JS token |
| `GEMINI_API_KEY` | Gemini itineraries and the MCP `plan_trip` tool |
| `NVIDIA_API_KEY` | Optional NVIDIA NIM provider |
| `OPENROUTER_API_KEY` | Optional OpenRouter provider |
| `BREVO_API_KEY` | Transactional email (OTP) |
| `NEXT_PUBLIC_WEATHER_API_KEY` | OpenWeatherMap widget |

See [`.env.example`](.env.example) for the full list.

---

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Development server with Turbopack on port 3001 |
| `pnpm build` | Production build |
| `pnpm start` | Start the production server |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript check |
| `pnpm test` | Vitest |
| `pnpm format` | Prettier |

---

## Project structure

```text
src/
├── app/
│   ├── (app)/            # Authenticated workspace: planner, explore, history
│   ├── (auth-pages)/     # Sign-in, sign-up, verify, reset
│   ├── (marketing)/      # About, services, request a feature
│   ├── api/              # Route handlers
│   ├── page.tsx          # Marketing homepage
│   ├── robots.ts         # Crawler rules, including AI bots
│   └── sitemap.ts        # Sitemap with real file mtimes
├── components/
│   ├── marketing/        # Homepage sections
│   ├── seo/              # JSON-LD renderer
│   └── website/          # Header, footer
├── lib/
│   ├── ai/               # Provider abstraction and RAG agent
│   ├── faq.ts            # Single source of truth for FAQ copy and schema
│   ├── schema.ts         # JSON-LD builders
│   └── site.ts           # Canonical URL and link constants
└── schemas/              # Zod itinerary schema

mcp/
├── server.mjs            # stdio MCP server
├── lib/travel.mjs        # Geocoding, places, weather, routes
├── lib/plan.mjs          # Gemini itinerary generation
└── test/client-smoke.mjs # End-to-end smoke test
```

---

## Contributing

Contributions are welcome. Read [`CONTRIBUTING.md`](CONTRIBUTING.md) before
opening a PR, and check [`ROADMAP.md`](ROADMAP.md) for planned work. Security
issues should go through [`SECURITY.md`](SECURITY.md), not public issues.

## License

MIT — see [`LICENSE`](LICENSE).
