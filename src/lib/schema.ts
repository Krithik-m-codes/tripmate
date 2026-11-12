import type { FaqItem } from "@/lib/faq";
import { GITHUB_URL, LICENSE_URL, OG_ALT, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

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
      description: "Free tier with 10 AI itinerary generations per month. No credit card required.",
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

export function faqPageSchema(faqs: FaqItem[], path = "/") {
  const url = path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    url,
    isPartOf: { "@id": `${url}#webpage` },
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

export function breadcrumbSchema(items: Array<{ name: string; path: `/${string}` }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path === "/" ? SITE_URL : `${SITE_URL}${item.path}`,
    })),
  };
}

export function techArticleSchema({
  path,
  headline,
  description,
  dependencies,
  keywords,
}: {
  path: `/${string}`;
  headline: string;
  description: string;
  dependencies?: string;
  keywords?: string[];
}) {
  const url = `${SITE_URL}${path}`;

  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${url}#article`,
    headline,
    description,
    url,
    mainEntityOfPage: { "@id": `${url}#webpage` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#software` },
    inLanguage: "en",
    proficiencyLevel: "Beginner",
    ...(dependencies ? { dependencies } : {}),
    ...(keywords ? { keywords: keywords.join(", ") } : {}),
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    license: LICENSE_URL,
  };
}

export function howToSchema({
  path,
  name,
  description,
  steps,
}: {
  path: `/${string}`;
  name: string;
  description: string;
  steps: Array<{ name: string; text: string }>;
}) {
  const url = `${SITE_URL}${path}`;

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${url}#howto`,
    name,
    description,
    url,
    mainEntityOfPage: { "@id": `${url}#webpage` },
    inLanguage: "en",
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
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
