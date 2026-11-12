import Link from "next/link";
import { ArrowRight, Github, ShieldCheck, Terminal } from "lucide-react";
import { AgentDemo } from "@/components/marketing/AgentDemo";
import { GITHUB_URL, LICENSE_URL, MCP_DOCS_URL } from "@/lib/site";

const BADGES = ["MIT licensed", "MCP-native", "Self-hostable"];

export function Hero() {
  return (
    <section id="product" className="relative overflow-hidden border-b border-[var(--border-primary)]">
      <div aria-hidden="true" className="tm-grid-bg pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-40 h-[520px] w-[520px] rounded-full bg-emerald-500/10 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-[1180px] px-5 pb-16 pt-12 sm:px-8 sm:pt-16 lg:px-10 lg:pb-24 lg:pt-20">
        <div className="grid items-start gap-12 lg:grid-cols-[0.94fr_1.06fr] lg:gap-10">
          <div className="max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              {BADGES.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-[var(--border-primary)] bg-[var(--bg-card)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-secondary)]"
                >
                  {badge}
                </span>
              ))}
            </div>

            <h1 className="mt-6 text-balance font-heading text-[2.6rem] font-extrabold leading-[1.04] tracking-[-0.035em] text-[var(--text-primary)] sm:text-6xl lg:text-[4.1rem]">
              Open-source, MCP-native trip planning{" "}
              <span className="text-emerald-600 dark:text-emerald-400">for your AI agent.</span>
            </h1>

            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-[var(--text-secondary)]">
              TripMate is an MIT-licensed AI trip planner that runs as an MCP
              server and a web app. It gives Claude Desktop, Cursor, and Claude
              Code live geocoding, place search, weather, and routing tools, then
              returns a structured, editable itinerary.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-colors hover:bg-emerald-700 active:scale-[0.99]"
              >
                Start planning free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={MCP_DOCS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] px-5 py-3 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:border-emerald-500/40"
              >
                <Terminal className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Read the MCP docs
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-[var(--text-secondary)] transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                <Github className="h-4 w-4" />
                GitHub repository
              </a>
              <a
                href={LICENSE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-[var(--text-secondary)] transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                <ShieldCheck className="h-4 w-4" />
                MIT license
              </a>
              <span className="text-[var(--text-muted)]">No credit card required</span>
            </div>

            <dl className="mt-8 grid max-w-md grid-cols-3 gap-4 border-t border-[var(--border-primary)] pt-5">
              {[
                { value: "5", label: "MCP tools" },
                { value: "10", label: "free plans / month" },
                { value: "MIT", label: "license" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                    {stat.label}
                  </dt>
                  <dd className="mt-1 font-heading text-xl font-bold text-[var(--text-primary)]">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <AgentDemo />
        </div>
      </div>
    </section>
  );
}
