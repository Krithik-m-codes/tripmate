import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "What is TripMate?",
    a: "TripMate is an AI-powered travel planning app that generates personalised day-by-day itineraries, helps you save favourite places, and lets you explore destinations on an interactive map — all in one workspace.",
  },
  {
    q: "Which AI models can I use to generate itineraries?",
    a: "TripMate supports Google Gemini (1.5 Flash and Pro), NVIDIA NIM models (Nemotron 70B, Mistral Nemo 12B), and OpenRouter models (Claude, GPT-4o, Llama 3.3). You choose the model directly in the AI Planner.",
  },
  {
    q: "What is RAG enhancement and should I enable it?",
    a: "RAG (Retrieval-Augmented Generation) injects curated travel knowledge — packing tips, seasonal advice, budget strategies, food discovery hacks — into your prompt before the AI generates. It's on by default and makes itineraries noticeably richer. You can toggle it off if you prefer a leaner, faster response.",
  },
  {
    q: "How do I get directions between two places?",
    a: "Open the Directions page from the sidebar. Enter your starting point and destination and TripMate will plot the fastest route on the map, powered by Mapbox.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Your account uses email-verified JWT sessions. OTP codes are generated and verified entirely server-side — they are never sent to the browser. Saved places and itineraries are stored under your user ID and are not accessible by other users.",
  },
  {
    q: "Can I use TripMate offline?",
    a: "TripMate currently requires an internet connection for AI generation, maps, and weather. Offline-first support (ServiceWorker caching for saved places and itineraries) is planned for a future release.",
  },
  {
    q: "How do I request a new feature?",
    a: "Use the 'Request a feature' page — there's a link in the footer. Every submission goes directly to the product roadmap review.",
  },
];

export default function FAQSection() {
  return (
    <section className="bg-zinc-50 dark:bg-[#0a0a0c] py-16 md:py-24 transition-colors duration-300">
      <div className="mx-auto max-w-3xl px-5 md:px-10">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block text-xs font-heading font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            FAQs
          </span>
          <h2 className="font-heading text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">
            Common questions
          </h2>
          <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400">
            Can&apos;t find the answer here?{" "}
            <a
              href="/request-feature"
              className="font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Contact us
            </a>
            .
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-2.5">
          {FAQS.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="rounded-xl border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-[#121216] px-4 shadow-2xs"
            >
              <AccordionTrigger className="py-5 text-left text-base font-heading font-semibold text-zinc-800 dark:text-zinc-100 hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-base leading-relaxed text-zinc-500 dark:text-zinc-400 font-normal">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
