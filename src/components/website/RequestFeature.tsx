"use client";
import Link from "next/link";
import { MessageSquarePlus, ArrowRight } from "lucide-react";

const RequestFeature = () => {
  return (
    <section className="relative overflow-hidden border-t border-zinc-200/80 dark:border-white/10 bg-white dark:bg-[#050505] py-16 md:py-24 transition-colors duration-300">
      {/* Decorative blob */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[500px] w-[500px] rounded-full bg-emerald-50 dark:bg-emerald-950/20 opacity-60 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-2xl px-5 text-center md:px-10">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/60">
          <MessageSquarePlus className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="font-heading text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">
          Missing something?
        </h2>
        <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400">
          TripMate is built in the open. If a feature would make your trips
          smoother, tell us — every request is reviewed for the roadmap.
        </p>
        <Link
          href="/request-feature"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:opacity-95 hover:shadow-emerald-500/40 active:scale-95"
        >
          Request a feature
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
};

export default RequestFeature;
