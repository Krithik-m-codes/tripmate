import Link from "next/link";
import { ArrowRight, Github } from "lucide-react";
import { GITHUB_URL, MCP_DOCS_URL } from "@/lib/site";

export function FinalCta() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-8 lg:px-10">
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-50 via-white to-white p-6 dark:from-emerald-950/30 dark:via-[var(--bg-card)] dark:to-[var(--bg-card)] sm:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl"
          />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                Start here
              </p>
              <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
                Give your agent a real travel stack.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
                Start with 10 free itineraries a month, or clone the repository and
                run the whole thing yourself. MIT licensed, no credit card.
              </p>
              <p className="mt-3 font-mono text-[10.5px] uppercase tracking-wider text-[var(--text-muted)]">
                Claude Desktop · Cursor · Claude Code
              </p>
            </div>

            <div className="flex flex-col gap-2.5 sm:flex-row lg:shrink-0">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-colors hover:bg-emerald-700"
              >
                Start planning free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] px-5 py-3 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:border-emerald-500/40"
              >
                <Github className="h-4 w-4" />
                Star on GitHub
              </a>
            </div>
          </div>

          <div className="relative mt-8 border-t border-emerald-500/15 pt-4">
            <a
              href={MCP_DOCS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-emerald-700 hover:underline dark:text-emerald-300"
            >
              Read the MCP setup guide →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
