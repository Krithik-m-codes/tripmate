import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";

// to access data easily, we need to extend the User object in the next-auth module 
// to include the new fields we added to the user object in the database.
// helps in accessing the user object easily in the session and jwt callbacks 

// Authentication options configuration for next-auth module
export const authOptions: NextAuthOptions = {
  // Providers array containing the credentials provider for email/password login 
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // Authorize function to check if user exists in database and password is correct
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          // Find user by email address in database and return user object
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier.toLowerCase() },
              { username: credentials.identifier },
            ],
          });
          // If no user found, throw error
          if (!user) {
            throw new Error("No user found with this email address");
          }

          if (!user.isVerified) {
            throw new Error("Email not verified");
          }

          // Compare password
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          // If password is invalid, throw error
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Invalid password");
          }
        } catch (err: any) {
          throw new Error("An error occurred while trying to log in");
        }
      },
    }),
  ],
  // Callbacks object containing JWT and session callbacks to add custom fields to token and session objects
  callbacks: {
    // JWT callback to add custom fields to token object when user logs in or signs up 
    async jwt({ token, user })  {
      if (user) {
        token._id = user._id?.toString();
        token.email = user.email;
        token.username = user.username;
        token.isVerified = user.isVerified;
      }
      return token;
    },
    // Session callback to add custom fields to session object when user logs in or signs up 
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.email = token.email;
        session.user.username = token.username;
        session.user.isVerified = token.isVerified;
      }
      return session;
    },
  },

  // Pages object containing the sign in page path 
  pages: {
    signIn: "/auth/login",
  },

  // JWT configuration object containing the JWT signing key and encryption algorithm 
  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
