import { z } from "zod";

export const searchHistorySchema = z.object({
  userId: z.string(),
  search: z.string(),
  createdAt: z.date(),
});
