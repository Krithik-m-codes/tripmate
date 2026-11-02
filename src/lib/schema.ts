import type { FaqItem } from "@/lib/faq";
import {
  GITHUB_URL,
  LICENSE_URL,
  OG_ALT,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "en",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icons/icon-512x512.png`,
    sameAs: [GITHUB_URL],
  };
}

export function softwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#software`,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    applicationCategory: "TravelApplication",
    applicationSubCategory: "AI trip planner",
    operatingSystem: "Web, macOS, Windows, Linux",
    url: SITE_URL,
    downloadUrl: GITHUB_URL,
    codeRepository: GITHUB_URL,
    license: LICENSE_URL,
    isAccessibleForFree: true,
    softwareVersion: "0.2.0",
    inLanguage: "en",
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    sameAs: [GITHUB_URL],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description:
        "Free tier with 10 AI itinerary generations per month. No credit card required.",
    },
    featureList: [
      "MCP server for Claude Desktop, Cursor, and Claude Code",
      "Structured, editable day-by-day itineraries",
      "Live geocoding and place search with OpenStreetMap",
      "Daily weather forecasts with Open-Meteo",
      "Driving routes with OSRM",
      "Multi-provider AI: Gemini, NVIDIA NIM, and OpenRouter",
      "Self-hostable with MongoDB",
      "MIT licensed",
    ],
    screenshot: `${SITE_URL}/opengraph-image`,
    image: `${SITE_URL}/opengraph-image`,
    potentialAction: {
      "@type": "UseAction",
      target: `${SITE_URL}/sign-up`,
      name: "Plan a trip with TripMate",
    },
    mainEntityOfPage: { "@id": `${SITE_URL}/#webpage` },
  };
}

export function faqPageSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function webPageSchema({
  path,
  title,
  description,
}: {
  path: string;
  title: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}${path}#webpage`,
    url: `${SITE_URL}${path}`,
    name: title,
    description,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#software` },
    inLanguage: "en",
  };
}

export { OG_ALT };
