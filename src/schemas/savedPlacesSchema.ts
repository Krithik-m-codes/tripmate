import { z } from "zod";

// Define a schema for the saved places form with validation rules for the name, location, description and image fields
export const SavedPlacesSchema = z.object({
  userId: z.string(),
  name: z
    .string()
    .min(3, { message: "Place Name must be atleast 3 characters" }),
  location: z
    .string()
    .min(3, { message: "Location must be atleast 3 characters" }),
  description: z
    .string()
    .min(3, { message: "Description must be atleast 3 characters" })
    .max(255, { message: "Description must be less than 255 characters" }),
  createdAt: z.date(),
});
