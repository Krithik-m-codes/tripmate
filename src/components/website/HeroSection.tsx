"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Calendar, Sparkles } from "lucide-react";

const STAT_PILLS = [
  { icon: Sparkles, text: "AI-generated itineraries" },
  { icon: MapPin, text: "Interactive maps" },
  { icon: Calendar, text: "Day-by-day planning" },
];

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-[#050505] transition-colors duration-300" id="MainContent">
      {/* Subtle background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-emerald-50 dark:bg-emerald-950/20 opacity-60 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-teal-50 dark:bg-teal-950/20 opacity-40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24 lg:px-16 lg:py-32">
        <div className="flex flex-col items-center gap-16 lg:flex-row lg:items-center">
          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 text-center lg:text-left"
          >
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-300 shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              Multi-provider AI — Gemini, NVIDIA NIM, OpenRouter
            </div>

            <h1 className="font-heading text-4xl font-extrabold leading-tight tracking-tight text-zinc-900 dark:text-white sm:text-5xl lg:text-6xl">
              Plan your next trip
              <br />
              in{" "}
              <span className="relative">
                <span className="text-gradient">seconds, not hours</span>
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-300 lg:text-xl font-normal">
              TripMate turns a destination, a date range, and your interests
              into a personalised, day-by-day itinerary — complete with hidden
              gems, cost breakdowns, and local food picks.
            </p>

            {/* Feature pills */}
            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              {STAT_PILLS.map(({ icon: Icon, text }) => (
                <span
                  key={text}
                  className="flex items-center gap-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-white/10 px-3 py-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-200 shadow-2xs"
                >
                  <Icon className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  {text}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:opacity-95 hover:shadow-emerald-500/40 active:scale-95"
              >
                Start planning free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-3.5 text-base font-semibold text-zinc-700 dark:text-zinc-200 transition-all hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-zinc-800 active:scale-95 shadow-xs"
              >
                See what&apos;s included
              </Link>
            </div>

            <p className="mt-4 text-sm text-zinc-400 dark:text-zinc-500">
              No credit card required. Verify once, explore everywhere.
            </p>
          </motion.div>

          {/* Right — hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-1 items-center justify-center"
          >
            <div className="relative">
              <Image
                src="/assets/hero-img.png"
                alt="TripMate app preview — AI-generated travel itinerary"
                width={560}
                height={520}
                className="w-full max-w-sm rounded-3xl drop-shadow-2xl lg:max-w-lg border border-zinc-200/50 dark:border-white/10"
                priority
              />
              {/* Floating card decoration */}
              <div className="absolute -bottom-4 -left-8 hidden rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-[#121216]/95 backdrop-blur-md px-4 py-3 shadow-xl lg:flex lg:items-center lg:gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60">
                  <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-heading font-semibold text-zinc-800 dark:text-white">Itinerary generated</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Bali · 7 days · Budget</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
