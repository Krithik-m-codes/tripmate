"use client";
import { SessionProvider } from "next-auth/react";

// AuthProvider component to wrap the application with the SessionProvider
// to provide the session object to all components

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
