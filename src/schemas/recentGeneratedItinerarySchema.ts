import { z } from "zod";

// Define a schema for the recently generated itinerary form with validation rules for the name, location, description fields

export const RecentGeneratedItinerarySchema = z.object({
  userId: z.string(),
  destination: z
    .string()
    .min(3, { message: "Destination must be atleast 3 characters" }),
  days: z.object({
    from: z.date(),
    to: z.date(),
  }),
  activities: z.array(z.string()),
  budget: z.string(),
  travelStyle: z.string(),
  itinerary: z
    .string()
    .min(3, { message: "Itinerary must be atleast 3 characters" }),
  createdAt: z.date(),
});
