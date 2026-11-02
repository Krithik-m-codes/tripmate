import { ArrowUpRight, Plus } from "lucide-react";
import { FAQS } from "@/lib/faq";
import { ISSUES_URL } from "@/lib/site";

export function FaqSection() {
  return (
    <section id="faq" className="border-b border-[var(--border-primary)] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
              FAQ
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
              Questions, answered.
            </h2>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-[var(--text-secondary)]">
              TripMate is free to start, works with Claude Desktop through MCP, and
              can be self-hosted under MIT. Here are the details.
            </p>
            <a
              href={ISSUES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-300"
            >
              Ask in GitHub Issues <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <div className="divide-y divide-[var(--border-primary)] border-y border-[var(--border-primary)]">
            {FAQS.map((faq, index) => (
              <details key={faq.id} className="group" open={index === 0}>
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
                  <h3 className="font-heading text-base font-semibold leading-snug text-[var(--text-primary)]">
                    {faq.question}
                  </h3>
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--border-primary)] text-[var(--text-muted)] transition-transform group-open:rotate-45">
                    <Plus className="h-3.5 w-3.5" />
                  </span>
                </summary>
                <p className="-mt-1 max-w-2xl pb-5 pr-8 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
