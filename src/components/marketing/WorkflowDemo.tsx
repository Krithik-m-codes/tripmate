"use client";

import { useState } from "react";
import {
  Check,
  CloudSun,
  GripVertical,
  MapPin,
  MessageSquare,
  Pencil,
  Route,
  Search,
  Sparkles,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "describe", label: "Describe", icon: MessageSquare },
  { id: "tools", label: "Run tools", icon: Wrench },
  { id: "edit", label: "Edit the plan", icon: Pencil },
] as const;

const TOOL_RUNS = [
  {
    name: "geocode_place",
    args: '"Lisbon, Portugal"',
    result: "38.7223, -9.1393",
    icon: MapPin,
    ms: "412 ms",
  },
  {
    name: "get_weather",
    args: "38.7223, -9.1393 · 5 days",
    result: "18–24°C · 10% rain",
    icon: CloudSun,
    ms: "186 ms",
  },
  {
    name: "search_places",
    args: '"attractions" · 8 km',
    result: "12 attractions · 8 restaurants",
    icon: Search,
    ms: "1.2 s",
  },
  {
    name: "get_directions",
    args: '"Lisbon" → "Sintra"',
    result: "28.4 km · 40 min driving",
    icon: Route,
    ms: "703 ms",
  },
];

const PLAN_ROWS = [
  { slot: "Morning", title: "Walk Alfama's lanes to São Jorge Castle", area: "Alfama", cost: "$18" },
  { slot: "Afternoon", title: "Lunch at Time Out Market", area: "Cais do Sodré", cost: "$22" },
  { slot: "Evening", title: "Sunset at Miradouro da Senhora do Monte", area: "Graça", cost: "$0" },
];

export function WorkflowDemo() {
  const [active, setActive] = useState<(typeof STEPS)[number]["id"]>("describe");

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {STEPS.map((step, index) => {
          const isActive = active === step.id;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => setActive(step.id)}
              aria-pressed={isActive}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors",
                isActive
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                  : "border-[var(--border-primary)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-emerald-500/30"
              )}
            >
              <span className="font-mono text-[10px] opacity-60">0{index + 1}</span>
              <step.icon className="h-3.5 w-3.5" />
              {step.label}
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between border-b border-[var(--border-primary)] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
            <span className="ml-2 font-mono text-[11px] text-[var(--text-muted)]">
              tripmate / agent workspace
            </span>
          </div>
          <span className="font-mono text-[10px] text-[var(--text-muted)]">Lisbon · 5 days</span>
        </div>

        <div className="grid lg:grid-cols-[0.88fr_1.12fr]">
          <div className="min-h-[430px] border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]/60 p-4 lg:border-b-0 lg:border-r">
            <div hidden={active !== "describe"} className="space-y-3">
              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-4">
                <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                  Prompt
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-primary)]">
                  Plan a 5-day trip to Lisbon for two. Mid-range budget, food-first,
                  one day trip outside the city.
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {["5 days", "2 travellers", "mid-range", "food"].map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-[var(--border-primary)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide text-[var(--text-muted)]"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white">
                  <span>Plan this trip</span>
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
              </div>
              <p className="px-1 text-[11px] leading-relaxed text-[var(--text-muted)]">
                The web app keeps the same input shape as the MCP tool: destination,
                dates, budget, style, and free-text preferences.
              </p>
            </div>

            <div hidden={active !== "tools"} className="space-y-2.5">
              {TOOL_RUNS.map((tool, index) => (
                <div
                  key={tool.name}
                  className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-3"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <tool.icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="font-mono text-[11px] text-[var(--text-primary)]">
                      {tool.name}
                    </span>
                    <span className="ml-auto font-mono text-[9px] text-[var(--text-muted)]">
                      {tool.ms}
                    </span>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  </div>
                  <p className="mt-1.5 truncate font-mono text-[10px] text-[var(--text-muted)]">
                    {tool.args}
                  </p>
                  <p className="mt-0.5 truncate font-mono text-[10px] text-emerald-700 dark:text-emerald-300">
                    → {tool.result}
                  </p>
                </div>
              ))}
              <p className="px-1 text-[11px] leading-relaxed text-[var(--text-muted)]">
                No invented coordinates. Each step is a real MCP tool call, and the
                model only sees the data that came back.
              </p>
            </div>

            <div hidden={active !== "edit"} className="space-y-3">
              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-4">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                    Day 1 · Alfama
                  </p>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                    Editable
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  {PLAN_ROWS.map((row) => (
                    <div
                      key={row.title}
                      className="flex items-start gap-2 rounded-lg border border-[var(--border-primary)] px-2.5 py-2"
                    >
                      <GripVertical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--text-muted)]" />
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-[9px] uppercase tracking-wide text-[var(--text-muted)]">
                          {row.slot}
                        </p>
                        <p className="text-[11.5px] leading-snug text-[var(--text-primary)]">
                          {row.title}
                        </p>
                      </div>
                      <span className="rounded border border-[var(--border-primary)] px-1.5 py-0.5 font-mono text-[9px] text-[var(--text-secondary)]">
                        {row.cost}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="px-1 text-[11px] leading-relaxed text-[var(--text-muted)]">
                Reorder activities, change a cost, swap a day. The plan is data, not
                a wall of text.
              </p>
            </div>
          </div>

          <div className="bg-[var(--bg-primary)]/40 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-heading text-base font-semibold text-[var(--text-primary)]">
                  Lisbon · 5 days
                </p>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Portugal · 18–24°C · sample output
                </p>
              </div>
              <span className="rounded-full border border-[var(--border-primary)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide text-[var(--text-muted)]">
                Day 1 / 5
              </span>
            </div>

            <div className="mt-4 space-y-2">
              {PLAN_ROWS.map((row, index) => (
                <div
                  key={row.title}
                  className="group rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-3 transition-colors hover:border-emerald-500/30"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[9px] uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                      {row.slot}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--text-secondary)]">
                      {row.cost}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium leading-snug text-[var(--text-primary)]">
                    {row.title}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">{row.area}</p>
                  {index === 0 && (
                    <div className="mt-2 flex items-center gap-3 border-t border-[var(--border-primary)] pt-2 text-[10px] text-[var(--text-muted)]">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> Pinned
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Check className="h-3 w-3 text-emerald-500" /> Validated
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { label: "Activities", value: "15" },
                { label: "Est. total", value: "$480–620" },
                { label: "Sources", value: "4" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-card)] px-2.5 py-2"
                >
                  <p className="font-mono text-[9px] uppercase tracking-wide text-[var(--text-muted)]">
                    {stat.label}
                  </p>
                  <p className="mt-0.5 text-xs font-semibold text-[var(--text-primary)]">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-3 text-center text-[11px] text-[var(--text-muted)]">
        Product preview with sample data. Tool names and output shapes match the
        MCP server in <span className="font-mono">mcp/</span>.
      </p>
    </div>
  );
}
