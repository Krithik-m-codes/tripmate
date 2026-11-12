import { z } from "zod";

// ─── Structured Itinerary Schema ──────────────────────────────────────────────
// This is the core schema that AI output is validated against.
// It enables: drag-drop editing, PDF export, budget tracking, timeline view,
// map integration, and structured search.

/**
 * A single activity within a day of the itinerary.
 */
export const ActivitySchema = z.object({
  id: z.string().describe("Unique identifier for this activity (e.g., 'd1-morning-1')"),
  timeSlot: z
    .enum(["morning", "afternoon", "evening"])
    .describe("Time of day for this activity"),
  title: z.string().describe("Short title of the activity"),
  description: z
    .string()
    .describe("Detailed description including what to do and why it's recommended"),
  location: z
    .object({
      name: z.string().describe("Place name"),
      lat: z.number().optional().describe("Latitude"),
      lng: z.number().optional().describe("Longitude"),
      address: z.string().optional().describe("Full address if available"),
    })
    .optional()
    .describe("Location details for map pin"),
  estimatedCost: z
    .object({
      amount: z.number().describe("Estimated cost in USD"),
      currency: z.string().default("USD").describe("Currency code"),
      breakdown: z.string().optional().describe("e.g., 'Entry fee: $15, Guide: $10'"),
    })
    .optional()
    .describe("Cost estimate for this activity"),
  category: z
    .enum(["sightseeing", "food", "transport", "accommodation", "activity", "shopping", "nightlife"])
    .describe("Type of activity — used for color-coding and budget categorization"),
  duration: z.string().optional().describe("e.g., '2 hours', '45 minutes'"),
  tips: z.string().optional().describe("Practical tip for this specific activity"),
  isHiddenGem: z
    .boolean()
    .default(false)
    .describe("Whether this is a lesser-known spot most tourists miss"),
  bookingUrl: z.string().url().optional().describe("Link to book or learn more"),
});

/**
 * A single day in the itinerary.
 */
export const ItineraryDaySchema = z.object({
  day: z.number().describe("Day number (1-indexed)"),
  date: z.string().describe("The date in YYYY-MM-DD format"),
  theme: z.string().describe("A short theme for the day, e.g., 'Cultural Immersion in Old Town'"),
  activities: z
    .array(ActivitySchema)
    .describe("All activities for this day, ordered chronologically"),
  accommodation: z
    .object({
      name: z.string(),
      type: z.string().describe("e.g., 'boutique hotel', 'hostel', 'airbnb'"),
      estimatedCost: z.number().describe("Per-night cost in USD"),
      tips: z.string().optional(),
    })
    .optional()
    .describe("Where to stay this night"),
  dailyCostEstimate: z.number().describe("Total estimated cost for this day in USD"),
  weather: z
    .object({
      temp: z.number().describe("Expected temperature in Celsius"),
      condition: z.string().describe("e.g., 'Partly cloudy', 'Sunny', 'Rain showers'"),
    })
    .optional()
    .describe("Expected weather for this day"),
});

/**
 * The complete structured itinerary output from AI.
 */
export const StructuredItinerarySchema = z.object({
  destination: z.string().describe("The trip destination"),
  summary: z
    .string()
    .describe("A 2-3 sentence overview of the entire trip"),
  days: z
    .array(ItineraryDaySchema)
    .describe("Day-by-day itinerary"),
  totalEstimatedCost: z
    .object({
      total: z.number().describe("Grand total in USD"),
      breakdown: z.object({
        accommodation: z.number(),
        food: z.number(),
        transport: z.number(),
        activities: z.number(),
        miscellaneous: z.number(),
      }).describe("Cost breakdown by category"),
    })
    .describe("Total trip cost estimate"),
  packingTips: z
    .array(z.string())
    .describe("Packing recommendations specific to this trip"),
  culturalNotes: z
    .array(z.string())
    .describe("Cultural tips and etiquette for the destination"),
  emergencyContacts: z
    .array(
      z.object({
        name: z.string().describe("e.g., 'Tourist Police', 'Embassy'"),
        number: z.string().describe("Phone number"),
      })
    )
    .optional()
    .describe("Useful emergency contacts at the destination"),
});

// ─── TypeScript Types ─────────────────────────────────────────────────────────
export type Activity = z.infer<typeof ActivitySchema>;
export type ItineraryDay = z.infer<typeof ItineraryDaySchema>;
export type StructuredItinerary = z.infer<typeof StructuredItinerarySchema>;

// ─── Validation Helper ────────────────────────────────────────────────────────
/**
 * Attempts to parse raw AI output as structured JSON.
 * Returns the parsed itinerary or null if parsing fails.
 */
export function parseStructuredItinerary(raw: unknown): StructuredItinerary | null {
  try {
    const result = StructuredItinerarySchema.safeParse(raw);
    if (result.success) return result.data;

    console.warn("Structured itinerary validation failed:", result.error.issues.slice(0, 5));
    return null;
  } catch {
    return null;
  }
}

/**
 * Checks whether a stored itinerary value is structured JSON or legacy plain text.
 */
export function isStructuredItinerary(
  itinerary: string | StructuredItinerary | Record<string, unknown>
): itinerary is StructuredItinerary {
  return (
    typeof itinerary === "object" &&
    itinerary !== null &&
    "days" in itinerary &&
    "destination" in itinerary &&
    Array.isArray((itinerary as StructuredItinerary).days)
  );
}
