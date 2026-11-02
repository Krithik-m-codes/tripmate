import type { Metadata } from "next";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Bot, MapPin, BarChart3, Map, Shield, RefreshCw, ArrowRight } from "lucide-react";
import { SITE_NAME } from "@/lib/site";

const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "TripMate — open-source, MCP-native trip planning for AI agents",
};

export const metadata: Metadata = {
  title: "Services",
  description:
    "What TripMate does: schema-validated AI itineraries, nearby place search, seasonal context, interactive maps, secure auth, and an open roadmap.",
  alternates: { canonical: "/services" },
  openGraph: {
    url: "/services",
    title: `Services · ${SITE_NAME}`,
    description:
      "What TripMate does: schema-validated AI itineraries, nearby place search, seasonal context, interactive maps, secure auth, and an open roadmap.",
    images: [OG_IMAGE],
  },
};

interface Service {
  icon: React.ElementType;
  title: string;
  tagline: string;
  description: string;
  imageUrl: string;
  detail: string;
}

const SERVICES: Service[] = [
  {
    icon: Bot,
    title: "AI Trip Planner",
    tagline: "Your personal travel strategist",
    description:
      "Generate full day-by-day itineraries in under 30 seconds. Pick from Gemini, NVIDIA NIM, or OpenRouter, and toggle RAG enhancement for smarter, context-aware plans.",
    imageUrl: "/assets/img/services-img/ai-trip-robot.jpeg",
    detail:
      "Every itinerary includes morning, afternoon, and evening slots; a hidden-gem pick; restaurant recommendations with dish names; accommodation options across budget tiers; transport between stops; daily cost estimates; and a custom packing list — all tuned to your travel season.",
  },
  {
    icon: MapPin,
    title: "Nearby place search",
    tagline: "Navigate like a local",
    description:
      "Search from your current map position for restaurants, attractions, and landmarks, then keep the results in your saved places and search history.",
    imageUrl: "/assets/img/services-img/real-time-loc.png",
    detail:
      "The slide-in results panel surfaces venues around the map centre. Switch between restaurants and attractions with one tap. Coordinates are validated before a marker is shown, so only places that can be pinned appear on the map.",
  },
  {
    icon: BarChart3,
    title: "Seasonal context",
    tagline: "Know before you go",
    description:
      "Itineraries include seasonal guidance, budget estimates, local customs, and food picks drawn from a curated knowledge base — clearly labelled as guidance, not live pricing.",
    imageUrl: "/assets/img/services-img/travel-insights.jpg",
    detail:
      "TripMate's RAG knowledge base holds curated travel notes covering budget strategies, packing essentials, monsoon versus winter travel, cultural etiquette, food discovery, accommodation tactics, safety essentials, and sustainable travel practices. These notes are injected into the planning prompt; they are not a live data feed.",
  },
  {
    icon: Map,
    title: "Interactive Maps",
    tagline: "See your whole trip at a glance",
    description:
      "Switch between street, satellite, outdoor, and light map styles. Saved places appear as markers so you can visualise your route before you leave.",
    imageUrl: "/assets/img/services-img/interactive-map.jpg",
    detail:
      "Powered by Mapbox GL. Supports smooth fly-to animations, GeolocateControl, and NavigationControl. The map works at zoom levels 3–20, making it useful for both city-level exploration and country-scale planning.",
  },
  {
    icon: Shield,
    title: "Secure Authentication",
    tagline: "Privacy by design",
    description:
      "Email-verified accounts with server-managed sessions. OTPs are generated and verified entirely server-side — your verification code never travels through the browser.",
    imageUrl: "/assets/img/services-img/secure-auth.jpg",
    detail:
      "Sign-up triggers server-side OTP generation and Brevo email delivery in one operation. Codes are time-limited and stored hashed. better-auth handles session management with a configurable secret, so session tokens are not kept in client-side state.",
  },
  {
    icon: RefreshCw,
    title: "Continuous Updates",
    tagline: "Built in the open",
    description:
      "New AI providers, map features, and design improvements ship regularly. Every feature request goes through a public review process on the roadmap.",
    imageUrl: "/assets/img/services-img/updates.jpg",
    detail:
      "The project roadmap is maintained in ROADMAP.md and updated in public. Because the app and MCP server share one repository, new tools and interface changes can be reviewed in the same place.",
  },
];

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="border-b border-slate-100 bg-slate-50 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-5 text-center md:px-10">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-emerald-600">
            Services
          </span>
          <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
            Everything in one workspace
          </h1>
          <p className="mt-6 text-lg text-slate-500">
            From AI itineraries to live maps — here&rsquo;s a detailed look at
            what TripMate does and how each feature works under the hood.
          </p>
        </div>
      </section>

      {/* Service detail rows */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-10 lg:px-16 space-y-24">
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className={`flex flex-col items-center gap-12 lg:flex-row ${
                i % 2 !== 0 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Image */}
              <div className="w-full overflow-hidden rounded-3xl shadow-xl lg:w-1/2">
                <Image
                  src={s.imageUrl}
                  alt={s.title}
                  width={800}
                  height={500}
                  className="h-72 w-full object-cover lg:h-96"
                />
              </div>

              {/* Copy */}
              <div className="flex-1 space-y-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                  <s.icon className="h-6 w-6 text-emerald-600" />
                </div>
                <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
                  {s.tagline}
                </p>
                <h2 className="text-3xl font-bold text-slate-900">{s.title}</h2>
                <p className="text-lg text-slate-500">{s.description}</p>
                <div className="rounded-xl bg-slate-50 p-5">
                  <p className="text-sm leading-relaxed text-slate-600">{s.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-100 bg-emerald-600 py-16">
        <div className="mx-auto max-w-xl px-5 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to try it?</h2>
          <p className="mt-4 text-lg text-emerald-100">
            Start free with 10 AI itineraries a month — no credit card required.
          </p>
          <Link
            href="/sign-up"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-emerald-700 shadow-lg transition-all hover:bg-emerald-50"
          >
            Get started free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
