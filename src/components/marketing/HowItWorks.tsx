import { Braces, MessageSquare, Wrench } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Describe the trip",
    body: "Destination, dates, budget, travel style, and anything that matters — food, accessibility, a slow pace. One request is enough.",
    code: `Plan a 5-day trip to Lisbon.
Mid-range. Food-first.
One day trip outside the city.`,
    language: "text",
  },
  {
    number: "02",
    icon: Wrench,
    title: "The agent queries real tools",
    body: "Through MCP, the agent geocodes the destination, checks the forecast, finds named places, and measures the day trip. No guessed coordinates.",
    code: `geocode_place("Lisbon, Portugal")
→ 38.7223, -9.1393

get_weather(38.7223, -9.1393)
→ 18–24°C · 10% rain

search_places(38.7223, -9.1393, "food")
→ 8 named restaurants`,
    language: "text",
  },
  {
    number: "03",
    icon: Braces,
    title: "Get a structured, editable plan",
    body: "The output is validated against a Zod schema: days, time slots, categories, estimated costs, packing tips. Edit it like data, not a chat log.",
    code: `{
  "day": 1,
  "theme": "Alfama & the river",
  "activities": [
    {
      "timeSlot": "morning",
      "title": "São Jorge Castle",
      "estimatedCostUsd": 18
    }
  ]
}`,
    language: "json",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-[var(--border-primary)] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-8 lg:px-10">
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
            How it works
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
            Three steps. No prompt engineering.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)]">
            Describe the trip, and the agent queries live tools through MCP. TripMate
            validates the result against a schema and returns a plan you can edit.
          </p>
        </div>

        <ol className="mt-12 grid gap-6 lg:grid-cols-3">
          {STEPS.map((step) => (
            <li
              key={step.number}
              className="relative flex flex-col rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-5"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <step.icon className="h-4 w-4" />
                </span>
                <span className="font-mono text-[11px] text-[var(--text-muted)]">
                  {step.number}
                </span>
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold text-[var(--text-primary)]">
                {step.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                {step.body}
              </p>
              <pre className="mt-5 overflow-x-auto rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 font-mono text-[10.5px] leading-relaxed text-[var(--text-secondary)]">
                <code>{step.code}</code>
              </pre>
            </li>
          ))}
        </ol>

        <p className="mt-6 text-xs text-[var(--text-muted)]">
          The schema mirrors{" "}
          <code className="rounded bg-[var(--bg-secondary)] px-1 py-0.5 font-mono text-[11px]">
            src/schemas/itinerarySchema.ts
          </code>
          . Costs are planning estimates, not live quotes.
        </p>
      </div>
    </section>
  );
}
