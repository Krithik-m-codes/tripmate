import Link from "next/link";
import {
  ArrowRight,
  Braces,
  CloudSun,
  Github,
  MapPin,
  Route,
  Sparkles,
  Terminal,
  Wrench,
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbSchema,
  faqPageSchema,
  howToSchema,
  techArticleSchema,
  webPageSchema,
} from "@/lib/schema";
import type { FaqItem } from "@/lib/faq";
import { GITHUB_URL, MCP_DOCS_URL, pageMetadata } from "@/lib/site";

const PAGE_PATH = "/mcp-server" as const;

const TITLE = "MCP server for Claude Desktop, Cursor, and Claude Code";
const DESCRIPTION =
  "Install TripMate's open-source MCP server to give Claude Desktop, Cursor, and Claude Code five live travel tools: geocoding, nearby places, weather, driving routes, and itinerary planning.";

export const metadata = pageMetadata({
  title: "MCP server",
  description: DESCRIPTION,
  path: PAGE_PATH,
  type: "article",
});

const TOOLS = [
  {
    name: "geocode_place",
    icon: MapPin,
    input: "query, limit",
    output:
      "Latitude, longitude, address, place type, and country code from OpenStreetMap Nominatim.",
    key: "None",
  },
  {
    name: "search_places",
    icon: Wrench,
    input: "latitude, longitude, category, radius_km, limit",
    output:
      "Named attractions, restaurants, cafes, hotels, or bars with coordinates, addresses, websites, and opening hours when tagged.",
    key: "None",
  },
  {
    name: "get_weather",
    icon: CloudSun,
    input: "latitude, longitude, days, start_date, end_date",
    output:
      "Daily min/max temperature, condition, and rain chance from Open-Meteo, up to 16 days ahead.",
    key: "None",
  },
  {
    name: "get_directions",
    icon: Route,
    input: "from, to",
    output: "Driving distance and duration between two named places from the public OSRM server.",
    key: "None",
  },
  {
    name: "plan_trip",
    icon: Sparkles,
    input:
      "destination, start_date, end_date, budget_level, travel_style, preferences, travelers, model",
    output:
      "A structured day-by-day itinerary built from live weather and nearby places, with estimated costs and packing tips.",
    key: "GEMINI_API_KEY",
  },
] as const;

const ENV_VARS = [
  {
    name: "GEMINI_API_KEY",
    required: "For plan_trip",
    purpose: "Google AI Studio key. The other four tools work without it.",
  },
  {
    name: "GEMINI_MODEL",
    required: "No",
    purpose: "Override the Gemini model. Defaults to gemini-1.5-flash.",
  },
  {
    name: "TRIPMATE_USER_AGENT",
    required: "No",
    purpose:
      "Contact string sent to Nominatim. Set this if you run your own instance or send steady traffic.",
  },
] as const;

const MCP_FAQS: FaqItem[] = [
  {
    id: "what",
    question: "What is the TripMate MCP server?",
    answer:
      "TripMate's MCP server is a local Model Context Protocol process that gives an AI client five travel tools: geocode_place, search_places, get_weather, get_directions, and plan_trip. It runs over stdio and needs no hosting.",
  },
  {
    id: "api-key",
    question: "Do I need an API key to use the MCP server?",
    answer:
      "No for four of the five tools. Geocoding, nearby place search, weather, and driving routes call free public services. Only plan_trip needs a Google Gemini API key.",
  },
  {
    id: "clients",
    question: "Which MCP clients work with TripMate?",
    answer:
      "Any MCP client that supports stdio transport, including Claude Desktop, Cursor, and Claude Code. The setup guide includes a ready-to-paste configuration block for each.",
  },
  {
    id: "offline",
    question: "Does the MCP server work offline?",
    answer:
      "No. Every tool calls a live public API: OpenStreetMap Nominatim, Open-Meteo, OSRM, or Google Gemini. The server itself is local, but the data is fetched at call time.",
  },
  {
    id: "read-only",
    question: "Can the MCP server change or book anything?",
    answer:
      "No. All five tools are read-only. The server cannot book flights, hotels, or activities, and the costs it returns are planning estimates rather than live quotes.",
  },
];

const HOW_TO_STEPS = [
  {
    name: "Clone the repository and install the server",
    text: "Run git clone https://github.com/Krithik-m-codes/tripmate.git, then cd tripmate/mcp and npm install. Node.js 20 or newer is required.",
  },
  {
    name: "Verify the server locally",
    text: "Run npm run check for a syntax check and npm run smoke to start the server, list the tools, and call the public APIs once.",
  },
  {
    name: "Add the server to your MCP client",
    text: "Add a tripmate entry to the mcpServers block of your client config. Use an absolute path to mcp/server.mjs and pass GEMINI_API_KEY in the env block if you want plan_trip.",
  },
  {
    name: "Restart the client and ask for a trip",
    text: "Restart the client, confirm that tripmate lists five tools, then ask it to plan a trip. The agent will call the tools it needs and return a structured itinerary.",
  },
];

function CodeBlock({ label, children }: { label: string; children: string }) {
  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]">
      <div className="border-b border-[var(--border-primary)] px-4 py-2 font-mono text-[10px] tracking-[0.14em] text-[var(--text-muted)] uppercase">
        {label}
      </div>
      <pre className="overflow-x-auto p-4 text-[12.5px] leading-relaxed">
        <code className="font-mono text-[var(--text-primary)]">{children}</code>
      </pre>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  id,
  children,
}: {
  eyebrow: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-2xl">
      <p className="font-mono text-[11px] tracking-[0.18em] text-emerald-600 uppercase dark:text-emerald-400">
        {eyebrow}
      </p>
      <h2
        id={id}
        className="font-heading mt-3 scroll-mt-24 text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl"
      >
        {children}
      </h2>
    </div>
  );
}

export default function McpServerPage() {
  return (
    <>
      <JsonLd
        data={[
          techArticleSchema({
            path: PAGE_PATH,
            headline: TITLE,
            description: DESCRIPTION,
            dependencies: "Node.js 20 or newer",
            keywords: [
              "MCP server",
              "Model Context Protocol",
              "Claude Desktop",
              "Cursor",
              "Claude Code",
              "travel tools",
            ],
          }),
          howToSchema({
            path: PAGE_PATH,
            name: "How to install the TripMate MCP server",
            description:
              "Install the TripMate MCP server and connect it to Claude Desktop, Cursor, or Claude Code.",
            steps: HOW_TO_STEPS,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "MCP server", path: PAGE_PATH },
          ]),
          faqPageSchema(MCP_FAQS, PAGE_PATH),
          webPageSchema({
            path: PAGE_PATH,
            title: TITLE,
            description: DESCRIPTION,
          }),
        ]}
      />

      <div className="bg-[var(--bg-primary)]">
        {/* Hero */}
        <section className="border-b border-[var(--border-primary)]">
          <div className="mx-auto w-full max-w-[1180px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
            <div className="max-w-3xl">
              <p className="font-mono text-[11px] tracking-[0.18em] text-emerald-600 uppercase dark:text-emerald-400">
                MCP server · MIT
              </p>
              <h1 className="font-heading mt-4 text-4xl leading-[1.08] font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl lg:text-[3.4rem]">
                Give Claude a real travel stack.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
                TripMate ships a Model Context Protocol server that exposes five travel tools over
                stdio: geocoding, nearby place search, weather, driving routes, and itinerary
                planning. Four of the five tools need no API key.
              </p>

              <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
                <Link
                  href="#install"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-colors hover:bg-emerald-700"
                >
                  Install the server
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={MCP_DOCS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] px-5 py-3 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:border-emerald-500/40"
                >
                  <Github className="h-4 w-4" />
                  Read the source
                </a>
              </div>

              <dl className="mt-10 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-4 border-t border-[var(--border-primary)] pt-6 sm:grid-cols-4">
                {[
                  ["Runtime", "Node 20+"],
                  ["Transport", "stdio"],
                  ["Tools", "5"],
                  ["License", "MIT"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="font-mono text-[10px] tracking-[0.14em] text-[var(--text-muted)] uppercase">
                      {label}
                    </dt>
                    <dd className="font-heading mt-1 text-sm font-semibold text-[var(--text-primary)]">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* What it does */}
        <section className="border-b border-[var(--border-primary)]">
          <div className="mx-auto w-full max-w-[1180px] px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
            <SectionHeading eyebrow="What it does" id="overview">
              The tools your agent was missing.
            </SectionHeading>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
              Most chat models guess at coordinates, opening hours, and drive times.
              TripMate&rsquo;s MCP server replaces those guesses with named API calls, so the
              itinerary is grounded in places that exist and a forecast that is current.
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: Terminal,
                  title: "Runs locally",
                  body: "A single Node process that speaks stdio. There is no TripMate account, no hosted endpoint, and no extra service to deploy.",
                },
                {
                  icon: Braces,
                  title: "Returns structured data",
                  body: "Tool responses are JSON. plan_trip parses Gemini's reply and returns days, activities, and estimated costs as data rather than prose.",
                },
                {
                  icon: Sparkles,
                  title: "Grounded in live sources",
                  body: "OpenStreetMap for places, Open-Meteo for forecasts, OSRM for routes, and Gemini for planning. Every source is named in the output.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6"
                >
                  <item.icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="font-heading mt-4 text-base font-semibold text-[var(--text-primary)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tools */}
        <section className="border-b border-[var(--border-primary)]">
          <div className="mx-auto w-full max-w-[1180px] px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
            <SectionHeading eyebrow="Tools" id="tools">
              Five tools, one server.
            </SectionHeading>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
              Each tool has a typed input schema and returns JSON. The first four are key-free;
              plan_trip adds AI planning on top of the same live data.
            </p>

            <div className="mt-8 overflow-x-auto rounded-2xl border border-[var(--border-primary)]">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="bg-[var(--bg-secondary)]">
                  <tr className="font-mono text-[10px] tracking-[0.14em] text-[var(--text-muted)] uppercase">
                    <th scope="col" className="px-4 py-3 font-medium">
                      Tool
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Input
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      What it returns
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Key
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-primary)] bg-[var(--bg-card)]">
                  {TOOLS.map((tool) => (
                    <tr key={tool.name} className="align-top">
                      <th scope="row" className="px-4 py-4 font-normal whitespace-nowrap">
                        <span className="flex items-center gap-2">
                          <tool.icon className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                          <code className="font-mono text-[12.5px] font-semibold text-[var(--text-primary)]">
                            {tool.name}
                          </code>
                        </span>
                      </th>
                      <td className="px-4 py-4 font-mono text-[11.5px] leading-relaxed text-[var(--text-muted)]">
                        {tool.input}
                      </td>
                      <td className="px-4 py-4 text-[13px] leading-relaxed text-[var(--text-secondary)]">
                        {tool.output}
                      </td>
                      <td className="px-4 py-4 font-mono text-[11.5px] whitespace-nowrap text-[var(--text-secondary)]">
                        {tool.key}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-[var(--text-muted)]">
              All tools are read-only. search_places accepts{" "}
              <code className="font-mono">attractions</code>,{" "}
              <code className="font-mono">food</code>, <code className="font-mono">cafes</code>,{" "}
              <code className="font-mono">hotels</code>, or{" "}
              <code className="font-mono">nightlife</code>, with a radius of 0.5–15 km.
            </p>
          </div>
        </section>

        {/* Install */}
        <section id="install" className="scroll-mt-24 border-b border-[var(--border-primary)]">
          <div className="mx-auto w-full max-w-[1180px] px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
            <SectionHeading eyebrow="Install" id="install-heading">
              Clone, install, verify.
            </SectionHeading>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
              The server lives in the <code className="font-mono text-[13px]">mcp/</code> directory
              next to the web app. You need Node.js 20 or newer and npm; nothing else is required
              for the four key-free tools.
            </p>

            <CodeBlock label="Terminal">{`git clone https://github.com/Krithik-m-codes/tripmate.git
cd tripmate/mcp
npm install

# Syntax check, then a live smoke test against the public APIs
npm run check
npm run smoke`}</CodeBlock>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
              The smoke test starts the server, lists its tools, and calls the public data sources
              once. If it passes, the server is ready to wire into a client.
            </p>
          </div>
        </section>

        {/* Clients */}
        <section className="border-b border-[var(--border-primary)]">
          <div className="mx-auto w-full max-w-[1180px] px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
            <SectionHeading eyebrow="Connect" id="clients">
              Works with the client you already use.
            </SectionHeading>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
              Any MCP client with stdio support can load the server. Use an absolute path to{" "}
              <code className="font-mono text-[13px]">server.mjs</code> and restart the client after
              changing its config.
            </p>

            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              <div>
                <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)]">
                  Claude Desktop
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                  Add the entry to{" "}
                  <code className="font-mono text-[12px]">claude_desktop_config.json</code>. On
                  macOS it lives at{" "}
                  <code className="font-mono text-[12px]">
                    ~/Library/Application Support/Claude/
                  </code>
                  ; on Windows at <code className="font-mono text-[12px]">%APPDATA%\Claude\</code>.
                  Use forward slashes in the path on Windows.
                </p>
                <CodeBlock label="claude_desktop_config.json">{`{
  "mcpServers": {
    "tripmate": {
      "command": "node",
      "args": ["/absolute/path/to/tripmate/mcp/server.mjs"],
      "env": {
        "GEMINI_API_KEY": "your-key-here"
      }
    }
  }
}`}</CodeBlock>
              </div>

              <div>
                <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)]">
                  Cursor
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                  Create <code className="font-mono text-[12px]">.cursor/mcp.json</code> in your
                  project, or add the same block to Cursor&rsquo;s global MCP settings. The config
                  shape is identical.
                </p>
                <CodeBlock label=".cursor/mcp.json">{`{
  "mcpServers": {
    "tripmate": {
      "command": "node",
      "args": ["/absolute/path/to/tripmate/mcp/server.mjs"],
      "env": {
        "GEMINI_API_KEY": "your-key-here"
      }
    }
  }
}`}</CodeBlock>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)]">
                Claude Code
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
                Register the server from your shell. Claude Code inherits the environment it starts
                with, so export <code className="font-mono text-[12px]">GEMINI_API_KEY</code> before
                launching it if you want plan_trip.
              </p>
              <CodeBlock label="Shell">{`claude mcp add tripmate -- node /absolute/path/to/tripmate/mcp/server.mjs

# POSIX shells
GEMINI_API_KEY=your-key-here claude

# PowerShell
$env:GEMINI_API_KEY="your-key-here"; claude`}</CodeBlock>
            </div>
          </div>
        </section>

        {/* Try it */}
        <section className="border-b border-[var(--border-primary)]">
          <div className="mx-auto w-full max-w-[1180px] px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
            <SectionHeading eyebrow="Try it" id="examples">
              Ask in plain language.
            </SectionHeading>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
              Once connected, describe the trip you want. The agent decides which tools to call,
              then hands back an itinerary you can edit.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                {
                  label: "Full itinerary",
                  prompt:
                    "Plan a 5-day trip to Lisbon in mid-November for two people. Mid-range budget, food-first, one day trip outside the city.",
                },
                {
                  label: "Direct tool call",
                  prompt: "Find four viewpoints near 38.7223, -9.1393 within 3 km.",
                },
                {
                  label: "Route plus weather",
                  prompt:
                    "What is the driving time from Lisbon to Sintra? Check the forecast for the day I go.",
                },
              ].map((example) => (
                <blockquote
                  key={example.label}
                  className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-5"
                >
                  <p className="font-mono text-[10px] tracking-[0.14em] text-[var(--text-muted)] uppercase">
                    {example.label}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-primary)]">
                    &ldquo;{example.prompt}&rdquo;
                  </p>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* Env vars */}
        <section className="border-b border-[var(--border-primary)]">
          <div className="mx-auto w-full max-w-[1180px] px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
            <SectionHeading eyebrow="Configuration" id="environment">
              Three variables, one optional key.
            </SectionHeading>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
              The server reads variables from the process environment, not from a{" "}
              <code className="font-mono text-[13px]">.env</code> file. Your MCP client must pass
              them through its <code className="font-mono text-[13px]">env</code> block.
            </p>

            <div className="mt-8 overflow-x-auto rounded-2xl border border-[var(--border-primary)]">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-[var(--bg-secondary)]">
                  <tr className="font-mono text-[10px] tracking-[0.14em] text-[var(--text-muted)] uppercase">
                    <th scope="col" className="px-4 py-3 font-medium">
                      Variable
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Required
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Purpose
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-primary)] bg-[var(--bg-card)]">
                  {ENV_VARS.map((row) => (
                    <tr key={row.name} className="align-top">
                      <th scope="row" className="px-4 py-4 font-normal whitespace-nowrap">
                        <code className="font-mono text-[12px] font-semibold text-[var(--text-primary)]">
                          {row.name}
                        </code>
                      </th>
                      <td className="px-4 py-4 text-[12px] whitespace-nowrap text-[var(--text-secondary)]">
                        {row.required}
                      </td>
                      <td className="px-4 py-4 text-[13px] leading-relaxed text-[var(--text-secondary)]">
                        {row.purpose}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
              Need the full web app too?{" "}
              <Link
                href="/self-hosting"
                className="font-semibold text-emerald-700 hover:underline dark:text-emerald-300"
              >
                See the self-hosting guide
              </Link>{" "}
              for database, auth, and email variables.
            </p>
          </div>
        </section>

        {/* Limits */}
        <section className="border-b border-[var(--border-primary)]">
          <div className="mx-auto w-full max-w-[1180px] px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
            <SectionHeading eyebrow="Limits" id="limits">
              Free public data has boundaries.
            </SectionHeading>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
              TripMate uses public, key-free services by default. They are fine for individual
              planning and demos, but they are not a bulk data feed.
            </p>

            <dl className="mt-8 grid gap-5 sm:grid-cols-2">
              {[
                {
                  term: "Nominatim",
                  detail:
                    "The public OpenStreetMap instance allows about one request per second. The server serialises calls, so large batches are slow by design. Set TRIPMATE_USER_AGENT for steady use.",
                },
                {
                  term: "Open-Meteo",
                  detail:
                    "Forecasts cover up to 16 days ahead. Dates beyond that window return a note instead of invented weather.",
                },
                {
                  term: "OSRM",
                  detail:
                    "get_directions uses the public OSRM demo server and returns driving routes only. Check OSRM's usage policy before production traffic.",
                },
                {
                  term: "plan_trip",
                  detail:
                    "Trips longer than 21 days are rejected. Costs are AI planning estimates, not live flight or hotel prices. Confirm opening hours and availability with the venue.",
                },
              ].map((item) => (
                <div
                  key={item.term}
                  className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-5"
                >
                  <dt className="font-heading text-sm font-semibold text-[var(--text-primary)]">
                    {item.term}
                  </dt>
                  <dd className="mt-2 text-[13px] leading-relaxed text-[var(--text-secondary)]">
                    {item.detail}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="border-b border-[var(--border-primary)]">
          <div className="mx-auto w-full max-w-[1180px] px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
            <SectionHeading eyebrow="Troubleshooting" id="troubleshooting">
              Four fixes that solve most setup issues.
            </SectionHeading>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
              Most connection problems come from a relative path, a stale client process, or a
              missing key. Check these first.
            </p>

            <div className="mt-8 overflow-x-auto rounded-2xl border border-[var(--border-primary)]">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="bg-[var(--bg-secondary)]">
                  <tr className="font-mono text-[10px] tracking-[0.14em] text-[var(--text-muted)] uppercase">
                    <th scope="col" className="px-4 py-3 font-medium">
                      Symptom
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Fix
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-primary)] bg-[var(--bg-card)]">
                  {[
                    [
                      "The client shows no tools",
                      "Use an absolute path to server.mjs, save the config, and fully restart the client.",
                    ],
                    [
                      "plan_trip reports a missing GEMINI_API_KEY",
                      "Add the key to the client's env block, or export it before starting Claude Code.",
                    ],
                    [
                      "Geocoding returns nothing",
                      "Use a more specific query, such as “Lisbon, Portugal” instead of “Lisbon”.",
                    ],
                    [
                      "Weather is missing for your dates",
                      "The trip is outside the 16-day forecast window. Plan with seasonal norms instead.",
                    ],
                  ].map(([symptom, fix]) => (
                    <tr key={symptom} className="align-top">
                      <th
                        scope="row"
                        className="px-4 py-4 text-left text-[13px] font-medium text-[var(--text-primary)]"
                      >
                        {symptom}
                      </th>
                      <td className="px-4 py-4 text-[13px] leading-relaxed text-[var(--text-secondary)]">
                        {fix}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-24 border-b border-[var(--border-primary)]">
          <div className="mx-auto w-full max-w-[1180px] px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
            <SectionHeading eyebrow="FAQ" id="faq-heading">
              MCP server questions.
            </SectionHeading>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
              Short answers to the questions that come up before installing.
            </p>

            <div className="mt-8 max-w-3xl divide-y divide-[var(--border-primary)] border-y border-[var(--border-primary)]">
              {MCP_FAQS.map((faq, index) => (
                <details key={faq.id} className="group" open={index === 0}>
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
                    <h3 className="font-heading text-base leading-snug font-semibold text-[var(--text-primary)]">
                      {faq.question}
                    </h3>
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--border-primary)] font-mono text-[var(--text-muted)] transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="-mt-1 max-w-2xl pr-8 pb-5 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 sm:py-16">
          <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-8 lg:px-10">
            <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-50 via-white to-white p-6 sm:p-10 dark:from-emerald-950/30 dark:via-[var(--bg-card)] dark:to-[var(--bg-card)]">
              <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-xl">
                  <p className="font-mono text-[11px] tracking-[0.18em] text-emerald-700 uppercase dark:text-emerald-300">
                    Next step
                  </p>
                  <h2 className="font-heading mt-3 text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
                    Wire it into your client in five minutes.
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
                    Clone the repository, run the smoke test, and paste one config block. The server
                    is MIT licensed and read-only by design.
                  </p>
                </div>
                <div className="flex flex-col gap-2.5 sm:flex-row lg:shrink-0">
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-colors hover:bg-emerald-700"
                  >
                    <Github className="h-4 w-4" />
                    Get the repository
                  </a>
                  <Link
                    href="/self-hosting"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] px-5 py-3 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:border-emerald-500/40"
                  >
                    Self-host the app
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
