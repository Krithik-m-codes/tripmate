import "next-auth";
import { DefaultSession } from "next-auth";

// having used interface while defining the user model object in the database,
// we need to extend the User model object in the next-auth module to include the new fields we added to the user object
// in the database. This is done by creating a new interface that extends the User object in the next-auth module
// and adding the new fields to it. The new interface is then merged with the User object in the next-auth module
// using the declaration merging feature of TypeScript.

declare module "next-auth" {
  interface User {
    _id?: string;
    email?: string;
    username?: string;
    isVerified?: boolean;
    // token : string
  }
  interface Session {
    user: {
      _id?: string;
      email?: string;
      username?: string;
      isVerified?: boolean;
      // token : string
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    email?: string;
    username?: string;
    isVerified?: boolean;
  }
}
