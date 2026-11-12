"use client";
import React from "react";

// AuthProvider now acts as a clean boundary/wrapper for Better Auth client components
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
