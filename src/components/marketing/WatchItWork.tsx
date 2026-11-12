import { WorkflowDemo } from "@/components/marketing/WorkflowDemo";

export function WatchItWork() {
  return (
    <section id="watch" className="border-b border-[var(--border-primary)] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
              Watch it work
            </p>
            <h2 className="mt-3 max-w-md font-heading text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
              Chat on the left. A real plan on the right.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-[var(--text-secondary)] lg:pb-1">
            One prompt becomes a tool run, then a plan you can edit. The agent calls
            TripMate&apos;s MCP tools and writes the result into structured JSON, so
            nothing important stays buried in chat.
          </p>
        </div>

        <div className="mt-10">
          <WorkflowDemo />
        </div>
      </div>
    </section>
  );
}
