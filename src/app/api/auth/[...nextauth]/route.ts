import NextAuth from "next-auth/next";
import { authOptions } from "./options";

// NextAuth handler to be used as a route in the API route
// to handle authentication requests and responses
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
