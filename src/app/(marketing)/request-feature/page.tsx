import type { Metadata } from "next";
import React from "react";
import { MessageSquarePlus, Clock, CheckCircle } from "lucide-react";
import { SITE_NAME } from "@/lib/site";

const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "TripMate — open-source, MCP-native trip planning for AI agents",
};

export const metadata: Metadata = {
  title: "Request a feature",
  description:
    "Suggest a feature for TripMate. Requests are read, grouped by theme, and considered against the public roadmap.",
  alternates: { canonical: "/request-feature" },
  openGraph: {
    url: "/request-feature",
    title: `Request a feature · ${SITE_NAME}`,
    description:
      "Suggest a feature for TripMate. Requests are read, grouped by theme, and considered against the public roadmap.",
    images: [OG_IMAGE],
  },
};

const HOW_IT_WORKS = [
  { icon: MessageSquarePlus, title: "Submit your idea", desc: "Fill in the Google Form below with as much detail as you like." },
  { icon: Clock, title: "Read and grouped", desc: "Submissions are read and grouped by theme as they come in." },
  { icon: CheckCircle, title: "Considered for the roadmap", desc: "Frequently requested work is weighed against ROADMAP.md and the project's scope." },
];

const RequestFeature = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="border-b border-slate-100 bg-slate-50 py-16 lg:py-24">
        <div className="mx-auto max-w-2xl px-5 text-center md:px-10">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
            <MessageSquarePlus className="h-7 w-7 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
            Request a feature
          </h1>
          <p className="mt-5 text-lg text-slate-500">
            TripMate is built in the open. Every request is read and reviewed
            for the product roadmap. No idea is too small.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-14 border-b border-slate-100">
        <div className="mx-auto max-w-4xl px-5 md:px-10">
          <div className="grid gap-8 sm:grid-cols-3">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.title} className="flex flex-col items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                  <step.icon className="h-5 w-5 text-emerald-600" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
                  Step {i + 1}
                </p>
                <h3 className="font-semibold text-slate-900">{step.title}</h3>
                <p className="text-sm text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Embedded form */}
      <section className="py-14">
        <div className="mx-auto max-w-3xl px-5 md:px-10">
          <h2 className="mb-6 text-center text-xl font-semibold text-slate-900">
            Submit your request
          </h2>
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLScuBtSg7dQG2mJMc0fnzYigEE9HG0r80gee-J5D_3rdiVquqw/viewform?embedded=true"
              width="100%"
              height="1200"
              title="Feature request form"
              className="block"
            >
              Loading form…
            </iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RequestFeature;
