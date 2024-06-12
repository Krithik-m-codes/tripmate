"use client";
import { SessionProvider } from "next-auth/react";

// session provider for the children nodes in the app
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
