"use client";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

const PERKS = [
  { icon: CheckCircle2, text: "Free to get started — no credit card needed" },
  { icon: Zap, text: "AI itineraries generated in under 30 seconds" },
  { icon: ShieldCheck, text: "OTP-secured sessions & private history" },
];

const CallToAction = () => {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-[#050505] py-20 md:py-28 transition-colors duration-300">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[500px] w-[800px] rounded-full bg-gradient-to-tr from-emerald-100 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 opacity-70 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-5 text-center md:px-10">
        <div className="rounded-3xl border border-emerald-100 dark:border-white/10 bg-gradient-to-b from-emerald-50/80 to-white dark:from-[#121216]/90 dark:to-[#0a0a0c]/90 p-8 shadow-xl md:p-14 backdrop-blur-md">
          <span className="mb-4 inline-block rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-4 py-1.5 text-xs font-heading font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
            Start your journey
          </span>

          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl md:text-5xl">
            Ready to plan your trip the{" "}
            <span className="text-emerald-600 dark:text-emerald-400">smart way?</span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-zinc-600 dark:text-zinc-300 md:text-lg">
            Create a free account, type where you want to go, and let TripMate
            build your complete day-by-day itinerary instantly.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/sign-up"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:opacity-95 hover:shadow-emerald-500/40 active:scale-95 sm:w-auto"
            >
              Build an itinerary now
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-4 text-base font-semibold text-zinc-700 dark:text-zinc-200 transition-all hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-zinc-800 active:scale-95 shadow-xs sm:w-auto"
            >
              Learn how it works
            </Link>
          </div>

          {/* Perks list */}
          <div className="mt-10 flex flex-wrap justify-center gap-6 border-t border-emerald-100 dark:border-white/10 pt-8 text-sm text-zinc-600 dark:text-zinc-300">
            {PERKS.map(({ icon: Icon, text }) => (
              <span key={text} className="flex items-center gap-2 font-medium">
                <Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
