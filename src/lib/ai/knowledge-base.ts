// Travel knowledge base — used for RAG context enrichment.
// Each entry is a chunk of curated travel wisdom injected into the agent prompt.
import dbConnect from "@/lib/dbConnect";
import TravelBrainEntry from "@/models/TravelBrainEntry.model";

export interface KnowledgeChunk {
  topic: string;
  content: string;
  tags: string[];
}

export const TRAVEL_KNOWLEDGE: KnowledgeChunk[] = [
  {
    topic: "Budget planning",
    tags: ["budget", "money", "costs"],
    content: `Budget breakdown rule of thumb: 30% accommodation, 25% food, 20% transport,
15% activities, 10% miscellaneous. Budget travellers can cut costs by staying in hostels
or guesthouses, eating at local markets, using public transit, and booking far in advance.
Luxury travellers should budget for private transfers, boutique hotels, and curated tours.`,
  },
  {
    topic: "Packing essentials",
    tags: ["packing", "gear", "preparation"],
    content: `Universal packing tips: carry-on only when possible (saves time, avoids loss).
Dress in layers for temperature variation. Pack a universal adapter, power bank, and reusable
water bottle. Keep a copy of all documents (passport, insurance) in cloud storage. Medications
and a small first-aid kit should be in hand luggage. Always include a microfibre towel and a
lightweight rain jacket regardless of season.`,
  },
  {
    topic: "Monsoon travel",
    tags: ["monsoon", "rain", "season", "weather"],
    content: `Monsoon season (June–September in South/Southeast Asia) brings lush landscapes
and far fewer crowds. Expect heavy afternoon rains — schedule outdoor activities for mornings.
Many beaches close but inland cultural sites remain accessible. Waterfalls and rivers are at
their most dramatic. Prices drop 30–50%. Pack waterproof bags, rain covers, and quick-dry
clothing. Flooding can affect low-lying areas; check local advisories.`,
  },
  {
    topic: "Winter travel",
    tags: ["winter", "cold", "snow", "season"],
    content: `Winter travel (Dec–Feb in Northern Hemisphere) offers fewer crowds at top sites,
lower prices, and festive experiences. Pack thermal layers, waterproof outerwear, and insulated
footwear. Mountain destinations require avalanche awareness. Book heated accommodation well
in advance. Short daylight hours (6–8 hrs) in Northern Europe/Canada require adjusted itineraries
— prioritise outdoor sights in the morning.`,
  },
  {
    topic: "Cultural etiquette",
    tags: ["culture", "etiquette", "customs", "local"],
    content: `Always research local customs before visiting: remove shoes at temples and
mosques, dress modestly at religious sites, ask before photographing people. Tipping norms
vary widely (expected in US at 15–20%, unusual in Japan). Learn basic greetings in the local
language — it creates immediate goodwill. Avoid pointing with a single finger in many Asian
cultures (use whole hand). Respect queue culture in UK/Australia.`,
  },
  {
    topic: "Transportation strategies",
    tags: ["transport", "flights", "trains", "local transit"],
    content: `Fly into a hub and use trains or buses for shorter legs — often cheaper and
more scenic than domestic flights. Rail passes (Eurail, Japan Rail Pass) are excellent for
multi-city trips in Europe and Japan. Use local apps for ground transport: Grab (SE Asia),
Ola (India), Gojek (Indonesia). Book trains 2–3 months ahead in popular corridors. Night
trains save accommodation costs. Low-cost carriers hide fees — always check baggage rules.`,
  },
  {
    topic: "Food discovery",
    tags: ["food", "cuisine", "restaurants", "street food"],
    content: `Best food rule: eat where locals eat, not where tourists gather. Market stalls
and street vendors often serve fresher, more authentic food than restaurants in tourist areas.
Visit local supermarkets for affordable lunches and snacks. Food tours on day 1 orient you
quickly. Vegetarian/vegan options are available in most cities but require research in rural
areas. Always carry allergy info translated into the local language.`,
  },
  {
    topic: "Accommodation strategy",
    tags: ["accommodation", "hotels", "hostels", "airbnb"],
    content: `Book 2–3 months ahead for popular destinations, especially in peak season.
Hostels offer the best social environment for solo travellers. Airbnb works well for groups
staying 5+ nights — kitchen access reduces food costs. Boutique hotels deliver character
without full luxury prices. For beach destinations, proximity to the beach is worth the premium.
Always read recent reviews (last 3 months) — properties change quickly.`,
  },
  {
    topic: "Safety essentials",
    tags: ["safety", "security", "emergency"],
    content: `Travel insurance is non-negotiable — medical evacuation from SE Asia or
Latin America can cost $50,000+. Keep digital copies of all documents. Register with your
embassy for high-risk destinations. Use ATMs inside banks only. Carry a small amount of
local cash at all times. Share your itinerary with someone at home. In new cities, arrive
during daylight hours. Trust your instincts — if something feels wrong, leave.`,
  },
  {
    topic: "Sustainable travel",
    tags: ["sustainability", "eco", "environment", "responsible"],
    content: `Offset flights when possible. Choose locally-owned accommodation and tour
operators. Avoid single-use plastics — carry reusable bags, straws, and containers. Don't
support wildlife attractions that exploit animals (elephant rides, tiger selfies). Respect
natural sites — stay on marked trails. Choose trains over domestic flights where journey
time allows. Eat locally-produced food to reduce the supply chain carbon footprint.`,
  },
];

/**
 * Simple keyword-based retrieval — finds the most relevant knowledge chunks
 * for a given travel context without requiring a vector database.
 */
export function retrieveRelevantChunks(
  destination: string,
  season: string,
  budget: string,
  preferences: string,
  travelStyle: string,
  topK = 4
): KnowledgeChunk[] {
  const query = [destination, season, budget, preferences, travelStyle]
    .join(" ")
    .toLowerCase();

  const scored = TRAVEL_KNOWLEDGE.map((chunk) => {
    const tagScore = chunk.tags.filter((t) => query.includes(t)).length;
    const contentScore = chunk.content
      .toLowerCase()
      .split(" ")
      .filter((word) => word.length > 4 && query.includes(word)).length;
    return { chunk, score: tagScore * 3 + contentScore };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((s) => s.chunk);
}

export interface CombinedKnowledgeResult {
  personalEntries: {
    id: string;
    title: string;
    category: string;
    destination?: string;
    content: string;
    tags: string[];
  }[];
  globalChunks: KnowledgeChunk[];
}

/**
 * Retrieves both the user's personal Travel Brain knowledge (from MongoDB)
 * and curated global travel knowledge chunks, ranking and scoring them against the context.
 */
export async function retrieveCombinedKnowledge(
  userId: string | undefined | null,
  destination: string,
  season: string,
  budget: string,
  preferences: string,
  travelStyle: string,
  topPersonalK = 5,
  topGlobalK = 3
): Promise<CombinedKnowledgeResult> {
  const globalChunks = retrieveRelevantChunks(
    destination,
    season,
    budget,
    preferences,
    travelStyle,
    topGlobalK
  );

  let personalEntries: CombinedKnowledgeResult["personalEntries"] = [];

  if (userId) {
    try {
      await dbConnect();
      const queryStr = [destination, season, budget, preferences, travelStyle]
        .join(" ")
        .toLowerCase();
      const words = queryStr
        .split(/\s+/)
        .filter((w) => w.length > 2)
        .map((w) => new RegExp(w, "i"));

      // Match user's own entries or shared team entries matching destination, tags, or content keywords
      const rawEntries = await TravelBrainEntry.find({
        $or: [
          { userId },
          { isShared: true },
        ],
      })
        .limit(30)
        .lean();

      // Score personal entries
      const scored = rawEntries.map((entry) => {
        let score = 0;
        const titleLower = entry.title.toLowerCase();
        const destLower = (entry.destination || "").toLowerCase();
        const contentLower = entry.content.toLowerCase();

        if (destLower && queryStr.includes(destLower)) score += 10;
        if (destLower && destination.toLowerCase().includes(destLower)) score += 15;

        entry.tags?.forEach((t: string) => {
          if (queryStr.includes(t.toLowerCase())) score += 5;
        });

        words.forEach((reg) => {
          if (reg.test(titleLower)) score += 3;
          if (reg.test(contentLower)) score += 1;
        });

        // Boost recently added or exact destination entries
        if (score === 0 && !entry.destination) score += 1; // General tips always get a baseline score

        return { entry, score };
      });

      personalEntries = scored
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, topPersonalK)
        .map((item) => ({
          id: item.entry._id.toString(),
          title: item.entry.title,
          category: item.entry.category,
          destination: item.entry.destination,
          content: item.entry.content,
          tags: item.entry.tags || [],
        }));
    } catch (err) {
      console.error("retrieveCombinedKnowledge DB error:", err);
    }
  }

  return {
    personalEntries,
    globalChunks,
  };
}

/**
 * Formats the combined RAG result into a clean text block to inject into system prompts.
 */
export function formatCombinedRAGContext(combined: CombinedKnowledgeResult): string {
  const parts: string[] = [];

  if (combined.personalEntries && combined.personalEntries.length > 0) {
    parts.push("=== USER'S PERSONAL TRAVEL BRAIN (PRIVATE KNOWLEDGE BASE) ===");
    parts.push(
      "IMPORTANT: The following notes and secrets were personally saved by the user. Prioritize these recommendations and incorporate them directly into the itinerary and advice:"
    );
    combined.personalEntries.forEach((entry) => {
      const destTag = entry.destination ? ` [Destination: ${entry.destination}]` : " [Global Tip]";
      parts.push(`- **${entry.title}** (${entry.category.replace(/_/g, " ")})${destTag}:\n  "${entry.content}"`);
    });
  }

  if (combined.globalChunks && combined.globalChunks.length > 0) {
    parts.push("\n=== CURATED GLOBAL TRAVEL WISDOM ===");
    combined.globalChunks.forEach((chunk) => {
      parts.push(`- **${chunk.topic}**: ${chunk.content}`);
    });
  }

  return parts.join("\n\n");
}

