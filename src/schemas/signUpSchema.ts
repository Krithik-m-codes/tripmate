import { z } from "zod";

// Define a schema for the username field with validation rules for the username
export const userNameValidation = z
  .string()
  .min(3, "Username must be atleast 3 characters")
  .max(255, "Username must be less than 255 characters")
  .regex(
    /^[a-zA-Z0-9_]*$/,
    "Username must contain only letters, numbers and underscores"
  );

// Define a schema for the sign up form with validation rules for the username, email, password fields
export const signUpSchema = z.object({
  username: userNameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, {
    message: "Password must be atleast 6 characters",
  }),
});
