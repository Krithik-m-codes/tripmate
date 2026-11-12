"use client";
import Image from "next/image";
import Link from "next/link";
import { Bot, MapPin, BarChart3, Map, Shield, RefreshCw } from "lucide-react";

const SERVICES = [
  {
    icon: Bot,
    title: "AI Trip Planner",
    description:
      "Generate personalised day-by-day itineraries in seconds. Choose from Gemini, NVIDIA NIM, or OpenRouter — and let RAG-enhanced context make every plan smarter.",
    img: "/assets/img/services-img/ai-trip-robot.jpeg",
  },
  {
    icon: MapPin,
    title: "Real-Time Location",
    description:
      "Find nearby restaurants, attractions, and hidden gems using live GPS. Every search is saved to your history so you can revisit great discoveries.",
    img: "/assets/img/services-img/real-time-loc.png",
  },
  {
    icon: BarChart3,
    title: "Travel Insights",
    description:
      "Understand your destination before you arrive — seasonal tips, cost breakdowns, local customs, and curated food picks tailored to your budget.",
    img: "/assets/img/services-img/travel-insights.jpg",
  },
  {
    icon: Map,
    title: "Interactive Maps",
    description:
      "Switch between street, satellite, outdoor, and light map styles. Saved places appear as markers so your whole trip is visible at a glance.",
    img: "/assets/img/services-img/interactive-map.jpg",
  },
  {
    icon: Shield,
    title: "Secure Authentication",
    description:
      "Email-verified accounts with JWT sessions. Your OTPs are generated server-side and never exposed to the client — privacy by design.",
    img: "/assets/img/services-img/secure-auth.jpg",
  },
  {
    icon: RefreshCw,
    title: "Always Improving",
    description:
      "New AI providers, design updates, and features ship regularly. Your feedback directly shapes the roadmap — request a feature any time.",
    img: "/assets/img/services-img/updates.jpg",
  },
];

const FEATURES = [
  { emoji: "🗓️", title: "Day-by-day planner", desc: "Morning, afternoon, and evening time slots for every day." },
  { emoji: "💰", title: "Cost estimates", desc: "Budget breakdowns per day, per category." },
  { emoji: "🍜", title: "Food picks", desc: "Specific dishes and restaurants, not generic advice." },
  { emoji: "💎", title: "Hidden gems", desc: "One lesser-known spot highlighted every day." },
  { emoji: "🌦️", title: "Season-aware", desc: "Activities adapt to your travel season automatically." },
  { emoji: "🧳", title: "Packing tips", desc: "Destination-specific packing lists at the end of every itinerary." },
];

const ServicesAndFeatures = () => {
  return (
    <>
      {/* ── Services grid ── */}
      <section className="bg-zinc-50 dark:bg-[#0a0a0c] py-20 lg:py-28 transition-colors duration-300" id="Services">
        <div className="mx-auto max-w-7xl px-5 md:px-10 lg:px-16">
          {/* Section header */}
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="mb-3 inline-block text-xs font-heading font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              What we offer
            </span>
            <h2 className="font-heading text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">
              Everything you need for smarter travel
            </h2>
            <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400">
              From AI-powered itineraries to live maps — all in one calm workspace.
            </p>
          </div>

          {/* Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="card-hover group relative overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-[#121216] shadow-xs transition-all hover:border-emerald-500/40 dark:hover:border-emerald-500/50"
              >
                <div className="h-44 overflow-hidden border-b border-zinc-100 dark:border-white/5">
                  <Image
                    src={s.img}
                    alt={s.title}
                    width={600}
                    height={300}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 dark:bg-emerald-500/20 text-white dark:text-emerald-400">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 font-heading text-lg font-semibold text-zinc-900 dark:text-white">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features strip ── */}
      <section className="bg-gradient-to-br from-emerald-600 to-teal-700 dark:from-[#081611] dark:via-[#0c2019] dark:to-[#081611] border-y border-emerald-500/20 dark:border-white/10 py-16 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-5 md:px-10 lg:px-16">
          <div className="mb-12 text-center">
            <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
              What every itinerary includes
            </h2>
            <p className="mt-2 text-emerald-100 dark:text-zinc-300">
              Powered by RAG-enhanced AI — not just a basic prompt.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="flex items-start gap-4 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/10 p-5 backdrop-blur-sm"
              >
                <span className="text-2xl shrink-0">{f.emoji}</span>
                <div>
                  <p className="font-heading font-semibold text-white">{f.title}</p>
                  <p className="mt-0.5 text-sm text-emerald-100 dark:text-zinc-400">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-emerald-500 px-6 py-3 text-sm font-semibold text-emerald-700 dark:text-white shadow-lg transition-all hover:bg-emerald-50 dark:hover:bg-emerald-600 active:scale-95"
            >
              Try it for free →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServicesAndFeatures;
