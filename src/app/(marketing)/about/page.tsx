import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Map, Bot, Heart } from "lucide-react";
import { SITE_NAME } from "@/lib/site";

const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "TripMate — open-source, MCP-native trip planning for AI agents",
};

export const metadata: Metadata = {
  title: "About",
  description:
    "Why TripMate exists: one calm workspace for AI itineraries, maps, saved places, and trip history — now open source and MCP-native.",
  alternates: { canonical: "/about" },
  openGraph: {
    url: "/about",
    title: `About · ${SITE_NAME}`,
    description:
      "Why TripMate exists: one calm workspace for AI itineraries, maps, saved places, and trip history — now open source and MCP-native.",
    images: [OG_IMAGE],
  },
};

const VALUES = [
  {
    icon: Bot,
    title: "AI-first, human-centred",
    desc: "We use the latest AI models as a starting point, not an endpoint. Every itinerary is a suggestion — you decide what stays.",
  },
  {
    icon: Map,
    title: "Built for explorers",
    desc: "Whether you're planning a weekend in a neighbouring city or a month across continents, TripMate adapts to your scale.",
  },
  {
    icon: Heart,
    title: "Calm over cluttered",
    desc: "No endless ads, dark patterns, or upsells. One workspace, all your trips — that's it.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="border-b border-slate-100 bg-slate-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-10 lg:px-16">
          <div className="mx-auto max-w-2xl text-center">
            <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-emerald-600">
              About
            </span>
            <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
              We help people travel without the chaos
            </h1>
            <p className="mt-6 text-lg text-slate-500">
              TripMate was built out of frustration with the 10-tabs approach to
              travel planning. We believe a good trip should start with a clear
              head, not a spreadsheet.
            </p>
            <Link
              href="/sign-up"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-700"
            >
              Start planning for free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Story + images */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-10 lg:px-16">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            {/* Image collage */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <Image
                  src="https://cdn.pixabay.com/photo/2024/05/18/19/21/plant-8770937_640.jpg"
                  alt="Travel destination"
                  width={400}
                  height={300}
                  className="w-full rounded-2xl object-cover shadow-md"
                />
                <Image
                  src="https://cdn.pixabay.com/photo/2024/02/04/10/47/arabiccontest-8551910_640.jpg"
                  alt="Cultural experience"
                  width={400}
                  height={300}
                  className="w-full rounded-2xl object-cover shadow-md"
                />
              </div>
              <div className="relative pt-8">
                <Image
                  src="https://cdn.pixabay.com/photo/2022/10/01/21/25/woman-7492273_640.jpg"
                  alt="Solo traveller"
                  width={400}
                  height={500}
                  className="w-full rounded-2xl object-cover shadow-md"
                />
              </div>
            </div>

            {/* Copy */}
            <div className="space-y-6">
              <span className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
                Our story
              </span>
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                Built by a traveller, for travellers
              </h2>
              <p className="text-lg text-slate-500">
                TripMate started as a personal project to solve a real
                frustration: too many apps, too many tabs, no single place where
                an itinerary, a map, and saved places lived together.
              </p>
              <p className="text-lg text-slate-500">
                Today it brings together AI-powered planning (Gemini, NVIDIA
                NIM, OpenRouter), live Mapbox maps, weather data, and a simple
                save-and-revisit workflow. The code is MIT-licensed on GitHub,
                and the MCP server lets Claude Desktop, Cursor, and Claude Code
                call the same travel tools.
              </p>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:underline"
              >
                See what TripMate can do
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-slate-100 bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-10 lg:px-16">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900">What we stand for</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                  <v.icon className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="mb-3 text-lg font-semibold text-slate-900">{v.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
