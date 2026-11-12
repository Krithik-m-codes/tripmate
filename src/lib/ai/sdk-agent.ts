import "server-only";
import { streamText, generateObject } from "ai";
import { getLanguageModel } from "./sdk-providers";
import { retrieveRelevantChunks, retrieveCombinedKnowledge, formatCombinedRAGContext } from "./knowledge-base";
import { StructuredItinerarySchema } from "@/schemas/itinerarySchema";
import type { TravelContext } from "./types";

// ─── System Prompts ──────────────────────────────────────────────────────────

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

const STRUCTURED_SYSTEM_PROMPT = `You are TripMate's expert travel planning agent. Generate a highly
detailed, structured travel itinerary. You must return a valid JSON object matching the provided
schema exactly. Include specific place names, realistic cost estimates in USD, and practical tips.

Rules:
- Every activity needs a unique ID in the format "d{day}-{timeSlot}-{index}" (e.g., "d1-morning-1")
- Include at least 2-3 activities per time slot
- Cost estimates should be realistic for the budget level
- Mark at least one hidden gem per day
- Include practical, destination-specific tips
- Keep tone warm, knowledgeable, and encouraging`;

const CHAT_SYSTEM_PROMPT = `You are TripMate's travel planning assistant. You help users plan trips
through natural conversation. You can:
1. Generate or modify travel itineraries
2. Suggest destinations, restaurants, and activities
3. Provide budget estimates and packing tips
4. Answer travel-related questions

When the user asks you to generate or modify an itinerary, produce a structured response.
When they ask general questions, respond conversationally.

Keep your responses concise but informative. Use emojis sparingly for warmth.`;

// ─── Prompt Builder ──────────────────────────────────────────────────────────

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

function buildRAGContext(ctx: TravelContext, useRAG: boolean): string {
  if (!useRAG) return "";

  const chunks = retrieveRelevantChunks(
    ctx.destination,
    ctx.season,
    ctx.budget,
    ctx.preferences,
    ctx.travelStyle,
    5
  );

  if (chunks.length === 0) return "";

  return `\n\n### Curated Travel Intelligence (use this to enrich your recommendations):\n${chunks
    .map((c) => `**${c.topic}**: ${c.content}`)
    .join("\n\n")}`;
}

async function buildAsyncRAGContext(
  ctx: TravelContext,
  useRAG: boolean,
  userId?: string
): Promise<string> {
  if (!useRAG) return "";

  const combined = await retrieveCombinedKnowledge(
    userId,
    ctx.destination,
    ctx.season,
    ctx.budget,
    ctx.preferences,
    ctx.travelStyle,
    6,
    4
  );

  const formatted = formatCombinedRAGContext(combined);
  if (!formatted.trim()) return "";

  return `\n\n### Curated & Personal Travel Intelligence (use this to enrich your recommendations):\n${formatted}`;
}

// ─── Streaming Text Generation ────────────────────────────────────────────────
/**
 * Streams a text-format itinerary token by token.
 * Used for the chat interface and legacy text output.
 */
export async function streamItinerary(
  ctx: TravelContext,
  providerName: string,
  modelId: string,
  useRAG = true,
  userId?: string
) {
  const model = getLanguageModel(providerName, modelId);
  const ragContext = await buildAsyncRAGContext(ctx, useRAG, userId);
  const prompt = buildItineraryPrompt(ctx) + ragContext;

  return streamText({
    model,
    system: SYSTEM_PROMPT,
    prompt,
    temperature: 0.75,
  });
}

// ─── Structured Object Generation ─────────────────────────────────────────────
/**
 * Generates a structured itinerary as validated JSON using `generateObject()`.
 * This is the preferred mode — it enables drag-drop, PDF export, budget tracking.
 *
 * Falls back to streaming text if structured generation fails (e.g., model doesn't
 * support JSON mode).
 */
export async function generateStructuredItinerary(
  ctx: TravelContext,
  providerName: string,
  modelId: string,
  useRAG = true,
  userId?: string
) {
  const model = getLanguageModel(providerName, modelId);
  const ragContext = await buildAsyncRAGContext(ctx, useRAG, userId);
  const prompt = buildItineraryPrompt(ctx) + ragContext;

  const result = await generateObject({
    model,
    schema: StructuredItinerarySchema,
    system: STRUCTURED_SYSTEM_PROMPT,
    prompt,
    temperature: 0.7,
  });

  return result;
}

// ─── Chat-based Streaming ─────────────────────────────────────────────────────
/**
 * Handles conversational chat messages with streaming responses.
 * Used by the new chat-based trip planner interface.
 */
export async function streamChat(
  messages: Array<any>,
  providerName: string,
  modelId: string,
  ragContext?: string
) {
  const model = getLanguageModel(providerName, modelId);

  const systemPrompt = ragContext
    ? `${CHAT_SYSTEM_PROMPT}\n\n${ragContext}`
    : CHAT_SYSTEM_PROMPT;

  // Convert UI messages (which may have `parts` instead of `content` string) into valid CoreMessage objects
  const normalizedMessages = messages.map((m: any) => {
    let content: string = "";
    if (typeof m.content === "string") {
      content = m.content;
    } else if (Array.isArray(m.parts)) {
      content = m.parts
        .filter((p: any) => p.type === "text" && typeof p.text === "string")
        .map((p: any) => p.text)
        .join("");
    } else if (typeof m.text === "string") {
      content = m.text;
    }

    const role = ["user", "assistant", "system"].includes(m?.role)
      ? (m.role as "user" | "assistant" | "system")
      : "user";

    return {
      role,
      content: content || " ",
    };
  });

  return streamText({
    model,
    system: systemPrompt,
    messages: normalizedMessages,
    temperature: 0.75,
  });
}

// ─── Legacy Compatibility ─────────────────────────────────────────────────────
/**
 * Non-streaming generation for backward compatibility.
 * Returns the same format as the old `generateItineraryWithRAG()`.
 */
export async function generateItineraryLegacy(
  ctx: TravelContext,
  providerName: string,
  modelId: string,
  useRAG = true,
  userId?: string
) {
  const result = await streamItinerary(ctx, providerName, modelId, useRAG, userId);

  // Consume the full stream to get the complete text
  let text = "";
  for await (const chunk of result.textStream) {
    text += chunk;
  }

  return {
    text: text.replace(/^\*{1,3}/gm, "").replace(/\*{1,3}$/gm, ""),
    provider: providerName,
    model: modelId,
  };
}
