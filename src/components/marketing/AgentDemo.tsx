"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  Check,
  CloudSun,
  GripVertical,
  MapPin,
  Search,
  Sparkles,
} from "lucide-react";
import { getDemoPlan } from "@/lib/demo-plan";
import { cn } from "@/lib/utils";

const TOOL_STEPS = [
  {
    name: "geocode_place",
    detail: "Resolve the destination",
    icon: MapPin,
  },
  {
    name: "get_weather",
    detail: "Check the trip dates",
    icon: CloudSun,
  },
  {
    name: "search_places",
    detail: "Find named places nearby",
    icon: Search,
  },
];

export function AgentDemo() {
  const [query, setQuery] = useState("Lisbon, Portugal");
  const [submitted, setSubmitted] = useState("Lisbon, Portugal");
  const [activeDay, setActiveDay] = useState(0);
  const [run, setRun] = useState(0);

  const plan = useMemo(() => getDemoPlan(submitted), [submitted]);
  const day = plan.days[activeDay] ?? plan.days[0];
  const isKnownSample = plan.country !== "Sample structure";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(query.trim() || "Lisbon, Portugal");
    setActiveDay(0);
    setRun((value) => value + 1);
  }

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute -inset-3 -z-10 rounded-[2rem] bg-emerald-500/10 blur-2xl"
      />
      <div className="overflow-hidden rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.55)]">
        {/* Window chrome */}
        <div className="flex items-center justify-between border-b border-[var(--border-primary)] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
            <span className="ml-2 font-mono text-[11px] text-[var(--text-muted)]">
              tripmate / planner
            </span>
          </div>
          <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
            MCP · stdio
          </span>
        </div>

        <div className="grid sm:grid-cols-[0.92fr_1.08fr]">
          {/* Chat side */}
          <div className="flex min-h-[420px] flex-col border-b border-[var(--border-primary)] sm:border-b-0 sm:border-r">
            <div className="flex-1 space-y-3 p-4">
              <div className="ml-auto max-w-[92%] rounded-xl rounded-br-sm bg-emerald-600 px-3 py-2 text-[13px] leading-snug text-white">
                Plan a 5-day trip to {submitted.split(",")[0]}. Mid-range, food-first.
              </div>

              <div className="space-y-2" key={run}>
                {TOOL_STEPS.map((step, index) => (
                  <div
                    key={step.name}
                    className="tm-rise flex items-start gap-2.5 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-2.5 py-2"
                    style={{ animationDelay: `${index * 180}ms` }}
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <step.icon className="h-3 w-3" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-mono text-[11px] text-[var(--text-secondary)]">
                        {step.name}
                      </p>
                      <p className="truncate text-[10px] text-[var(--text-muted)]">
                        {step.detail}
                      </p>
                    </div>
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  </div>
                ))}
              </div>

              <div
                className="tm-rise flex items-start gap-2 rounded-xl bg-[var(--bg-secondary)] px-3 py-2.5"
                style={{ animationDelay: "620ms" }}
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-600 text-white">
                  <Sparkles className="h-3 w-3" />
                </span>
                <p className="text-[12px] leading-relaxed text-[var(--text-secondary)]">
                  Found {plan.days.length} days of places near{" "}
                  <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                    {plan.coordinates}
                  </span>
                  . Drafting a plan around the weather and opening hours.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="border-t border-[var(--border-primary)] p-3">
              <label
                htmlFor="demo-destination"
                className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]"
              >
                Plan a 5-day trip to…
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="demo-destination"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Lisbon, Portugal"
                  className="h-9 min-w-0 flex-1 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] px-3 text-[12px] text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-emerald-500/60"
                />
                <button
                  type="submit"
                  className="h-9 shrink-0 rounded-lg bg-emerald-600 px-3 text-[12px] font-semibold text-white transition-colors hover:bg-emerald-700"
                >
                  Preview
                </button>
              </div>
            </form>
          </div>

          {/* Plan side */}
          <div className="flex min-h-[420px] flex-col bg-[var(--bg-primary)]/40">
            <div className="flex items-start justify-between gap-3 border-b border-[var(--border-primary)] px-4 py-3">
              <div>
                <p className="font-heading text-sm font-semibold text-[var(--text-primary)]">
                  {plan.city} · {plan.days.length} days
                </p>
                <p className="text-[10px] text-[var(--text-muted)]">
                  {plan.country} · {plan.weather}
                </p>
              </div>
              <span className="rounded-full border border-[var(--border-primary)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                Sample
              </span>
            </div>

            <div className="flex gap-1 overflow-x-auto border-b border-[var(--border-primary)] px-3 py-2">
              {plan.days.map((item, index) => (
                <button
                  key={item.day}
                  type="button"
                  onClick={() => setActiveDay(index)}
                  aria-pressed={activeDay === index}
                  className={cn(
                    "shrink-0 rounded-md px-2 py-1 font-mono text-[10px] transition-colors",
                    activeDay === index
                      ? "bg-emerald-600 text-white"
                      : "text-[var(--text-muted)] hover:bg-[var(--bg-secondary)]"
                  )}
                >
                  D{item.day}
                </button>
              ))}
            </div>

            <div className="flex-1 p-3">
              <p className="mb-2 px-1 font-mono text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Day {day.day} · {day.theme}
              </p>
              <div className="space-y-1.5">
                {day.activities.map((activity, index) => (
                  <div
                    key={`${run}-${day.day}-${activity.title}`}
                    className="tm-rise group flex items-start gap-2 rounded-lg border border-transparent bg-[var(--bg-card)] px-2.5 py-2 transition-colors hover:border-[var(--border-primary)]"
                    style={{ animationDelay: `${index * 90}ms` }}
                  >
                    <GripVertical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--text-muted)] opacity-40" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[9px] uppercase tracking-wide text-[var(--text-muted)]">
                          {activity.slot}
                        </span>
                        <span className="rounded-sm bg-[var(--bg-secondary)] px-1 py-0.5 text-[8px] uppercase tracking-wide text-[var(--text-muted)]">
                          {activity.category}
                        </span>
                      </div>
                      <p className="text-[11.5px] font-medium leading-snug text-[var(--text-primary)]">
                        {activity.title}
                      </p>
                      <p className="text-[9.5px] text-[var(--text-muted)]">{activity.area}</p>
                    </div>
                    <span className="font-mono text-[10px] text-[var(--text-secondary)]">
                      {activity.cost}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[var(--border-primary)] px-4 py-2.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[var(--text-muted)]">Estimated total</span>
                <span className="font-mono text-[var(--text-primary)]">{plan.total}</span>
              </div>
              <p className="mt-1 truncate text-[9.5px] text-[var(--text-muted)]">
                Food: {plan.food}
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-3 text-center text-[11px] leading-relaxed text-[var(--text-muted)]">
        Interactive sample with {isKnownSample ? "real place names" : "a generic structure"}.{" "}
        <a href="/sign-up" className="font-medium text-emerald-600 hover:underline dark:text-emerald-400">
          Sign in
        </a>{" "}
        to generate with live data.
      </p>
    </div>
  );
}
