import {
  Braces,
  Check,
  CloudSun,
  GripVertical,
  MapPin,
  Radio,
  Route,
  Search,
  Terminal,
} from "lucide-react";

const TOOLS = [
  { name: "geocode_place", result: "38.7223, -9.1393", icon: MapPin },
  { name: "get_weather", result: "18–24°C · 10% rain", icon: CloudSun },
  { name: "search_places", result: "12 attractions · 8 restaurants", icon: Search },
  { name: "get_directions", result: "Sintra · 28.4 km · 40 min", icon: Route },
];

function StructureMockup() {
  return (
    <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-4 shadow-[0_24px_60px_-36px_rgba(0,0,0,0.45)]">
      <div className="flex items-center justify-between border-b border-[var(--border-primary)] pb-3">
        <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
          Day 1 · Alfama &amp; the river
        </p>
        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
          Editable
        </span>
      </div>
      <div className="mt-3 space-y-2">
        {[
          { slot: "Morning", title: "São Jorge Castle", cost: "$18" },
          { slot: "Afternoon", title: "Time Out Market", cost: "$22" },
          { slot: "Evening", title: "Miradouro da Senhora do Monte", cost: "$0" },
        ].map((row) => (
          <div
            key={row.title}
            className="flex items-start gap-2 rounded-lg border border-[var(--border-primary)] px-2.5 py-2"
          >
            <GripVertical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--text-muted)]" />
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[9px] uppercase tracking-wide text-[var(--text-muted)]">
                {row.slot}
              </p>
              <p className="text-[12px] leading-snug text-[var(--text-primary)]">{row.title}</p>
            </div>
            <span className="rounded border border-[var(--border-primary)] px-1.5 py-0.5 font-mono text-[9px] text-[var(--text-secondary)]">
              {row.cost}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-[var(--border-primary)] pt-3">
        <span className="font-mono text-[10px] text-[var(--text-muted)]">daily total</span>
        <span className="font-mono text-[11px] text-[var(--text-primary)]">$40 est.</span>
      </div>
    </div>
  );
}

function ToolsMockup() {
  return (
    <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-4 shadow-[0_24px_60px_-36px_rgba(0,0,0,0.45)]">
      <div className="flex items-center justify-between border-b border-[var(--border-primary)] pb-3">
        <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
          tool run · 4 calls
        </p>
        <span className="inline-flex items-center gap-1 font-mono text-[9px] text-emerald-600 dark:text-emerald-400">
          <Radio className="h-3 w-3" /> live
        </span>
      </div>
      <div className="mt-3 space-y-2">
        {TOOLS.map((tool) => (
          <div
            key={tool.name}
            className="flex items-center gap-2.5 rounded-lg border border-[var(--border-primary)] px-2.5 py-2"
          >
            <tool.icon className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span className="min-w-0 flex-1 truncate font-mono text-[10.5px] text-[var(--text-primary)]">
              {tool.name}
            </span>
            <span className="hidden truncate font-mono text-[9.5px] text-[var(--text-muted)] sm:block">
              {tool.result}
            </span>
            <Check className="h-3 w-3 shrink-0 text-emerald-500" />
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5 border-t border-[var(--border-primary)] pt-3">
        {["OpenStreetMap", "Open-Meteo", "OSRM"].map((source) => (
          <span
            key={source}
            className="rounded-full border border-[var(--border-primary)] px-2 py-0.5 font-mono text-[9px] text-[var(--text-muted)]"
          >
            {source}
          </span>
        ))}
      </div>
    </div>
  );
}

function SelfHostMockup() {
  return (
    <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-4 shadow-[0_24px_60px_-36px_rgba(0,0,0,0.45)]">
      <div className="flex items-center gap-2 border-b border-[var(--border-primary)] pb-3">
        <Terminal className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
        <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
          self-host
        </p>
      </div>
      <pre className="mt-3 overflow-x-auto font-mono text-[10.5px] leading-relaxed text-[var(--text-secondary)]">
        <code>{`$ git clone ${"https://github.com/Krithik-m-codes/tripmate.git"}
$ pnpm install && pnpm dev

  ✓ web app on :3001
  ✓ MongoDB connected

$ claude mcp add tripmate -- node mcp/server.mjs

  ✓ 5 tools registered`}</code>
      </pre>
      <div className="mt-3 flex flex-wrap gap-1.5 border-t border-[var(--border-primary)] pt-3">
        {["Gemini", "NVIDIA NIM", "OpenRouter", "MIT"].map((chip) => (
          <span
            key={chip}
            className="rounded-full border border-[var(--border-primary)] px-2 py-0.5 font-mono text-[9px] text-[var(--text-muted)]"
          >
            {chip}
          </span>
        ))}
      </div>
    </div>
  );
}

const SLICES = [
  {
    label: "01 / Structure",
    icon: Braces,
    title: "A plan that behaves like data",
    body: "Every itinerary is validated against a schema before it reaches you: days, time slots, categories, costs, and tips. That is why you can drag an activity, change a cost, or swap a day without losing the structure.",
    mockup: <StructureMockup />,
  },
  {
    label: "02 / Live tools",
    icon: Radio,
    title: "Real coordinates, not confident guesses",
    body: "The agent calls five MCP tools instead of guessing. Geocoding, place search, weather, and driving routes come from OpenStreetMap, Open-Meteo, and OSRM, with sources attached to the result.",
    mockup: <ToolsMockup />,
  },
  {
    label: "03 / Ownership",
    icon: Terminal,
    title: "Your model, your machine, your license",
    body: "Use Gemini, NVIDIA NIM, or OpenRouter, or self-host the whole stack under MIT. The web app and MCP server live in the same repository, with no hosted dependency required.",
    mockup: <SelfHostMockup />,
  },
];

export function FeatureSlices() {
  return (
    <section id="features" className="border-b border-[var(--border-primary)] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-8 lg:px-10">
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
            Feature depth
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
            Built like a tool, not a chat toy.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)]">
            Three things separate TripMate from a generic travel chatbot: structured
            output, live data, and code you can run yourself.
          </p>
        </div>

        <div className="mt-12 space-y-14 lg:space-y-20">
          {SLICES.map((slice, index) => (
            <div
              key={slice.label}
              className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-14 ${
                index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <slice.icon className="h-4 w-4" />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                    {slice.label}
                  </span>
                </div>
                <h3 className="mt-4 font-heading text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-[1.7rem]">
                  {slice.title}
                </h3>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
                  {slice.body}
                </p>
              </div>
              <div>{slice.mockup}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
