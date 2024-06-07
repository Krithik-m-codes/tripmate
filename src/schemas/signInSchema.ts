import { z } from "zod";

// Define a schema for the sign in form with validation rules for the identifier [email here but can be anything ]  and password fields 
export const signInSchema = z.object({
  identifier: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, {
    message: "Password must be atleast 6 characters",
  }),
});
