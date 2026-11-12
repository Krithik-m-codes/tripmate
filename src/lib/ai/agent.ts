import "server-only";
import { getProvider } from "./providers";
import { retrieveRelevantChunks } from "./knowledge-base";
import type { TravelContext, GenerateResult } from "./types";

const SYSTEM_PROMPT = `You are TripMate's expert travel planning agent. You have deep knowledge
of global destinations, local cultures, seasonal weather patterns, accommodation options,
transportation networks, and budget management. You create highly personalised, practical,
and memorable travel itineraries that balance iconic sights with authentic local experiences.

Formatting rules:
- Use clear section headers for each day (Day 1: <Date>)
- Use Morning / Afternoon / Evening time slots
- Include specific place names, not generic descriptions
- Add estimated costs in local currency and USD equivalents
- Bold key highlights with **text**
- Keep tone warm, knowledgeable, and encouraging
- Never use asterisks for bullet points — use dashes or numbered lists`;

/**
 * RAG travel agent — enriches the prompt with retrieved knowledge before generating.
 * Falls back gracefully when RAG context adds no value.
 */
export async function generateItineraryWithRAG(
  ctx: TravelContext,
  providerName: string,
  modelId: string,
  useRAG = true
): Promise<GenerateResult> {
  const provider = getProvider(providerName);

  // Step 1: Retrieve relevant knowledge chunks
  const chunks = useRAG
    ? retrieveRelevantChunks(
        ctx.destination,
        ctx.season,
        ctx.budget,
        ctx.preferences,
        ctx.travelStyle,
        5
      )
    : [];

  const ragContext =
    chunks.length > 0
      ? `\n\n### Curated Travel Intelligence (use this to enrich your recommendations):\n${chunks.map((c) => `**${c.topic}**: ${c.content}`).join("\n\n")}`
      : "";

  // Step 2: Build the enriched prompt
  const prompt = buildItineraryPrompt(ctx) + ragContext;

  // Step 3: Generate with selected provider
  const result = await provider.generate({
    model: modelId,
    prompt,
    systemPrompt: SYSTEM_PROMPT,
    maxTokens: 8192,
    temperature: 0.75,
  });

  // Step 4: Clean and return
  return {
    ...result,
    text: result.text.replace(/^\*{1,3}/gm, "").replace(/\*{1,3}$/gm, ""),
  };
}

function buildItineraryPrompt(ctx: TravelContext): string {
  return `Generate a highly detailed, day-by-day travel itinerary for the following trip:

**Destination:** ${ctx.destination}
**Dates:** ${ctx.startDate} to ${ctx.endDate} (${ctx.days} days)
**Season:** ${ctx.season}
**Budget level:** ${ctx.budget}
**Travel style:** ${ctx.travelStyle}
**Interests & preferences:** ${ctx.preferences || "General sightseeing, local food, cultural experiences"}

For each day include:
1. Morning / Afternoon / Evening schedule with specific activities and timings
2. One "hidden gem" — a lesser-known spot most tourists miss
3. Accommodation recommendation matching the budget
4. Transport between locations
5. Meal recommendations (breakfast spot, lunch, dinner) with dish names
6. Estimated daily cost breakdown (accommodation + food + transport + activities)
7. One practical tip specific to that day

After all days, include:
- Total estimated trip budget breakdown by category
- Top 5 travel tips specific to ${ctx.destination} in ${ctx.season}
- What to pack for this specific trip
- 3 emergency contacts / useful local resources

Start directly with Day 1. Use clear headers. Be specific with place names.`;
}
