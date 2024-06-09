import { z } from "zod";

export const acceptSavedPlacesSchema = z.object({
  acceptPlaces: z.boolean(),
});
