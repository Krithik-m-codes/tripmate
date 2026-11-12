import { z } from "zod";

export const userNameValidation = z
  .string()
  .trim()
  .min(3, "Username must be at least 3 characters")
  .max(255, "Username must be less than 255 characters")
  .regex(/^[a-zA-Z0-9_]*$/, "Username must contain only letters, numbers and underscores");

export const signUpSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  username: userNameValidation,
  email: z.string().trim().email({ message: "Invalid email address" }),
});
