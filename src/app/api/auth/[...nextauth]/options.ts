import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";

// Authentication options configuration for next-auth module
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
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
  callbacks: {
    async jwt({ token, user })  {
      if (user) {
        token._id = user._id?.toString();
        token.email = user.email;
        token.username = user.username;
        token.role = user.role;
        token.isVerified = user.isVerified;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
