import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Script from "next/script";
import AuthProvider from "../context/AuthProvider";

// Pinwren feedback widget: rendered only when a public project key is set.
const pinwrenUrl = (
  process.env.NEXT_PUBLIC_PINWREN_URL || "https://bug.shubpy.com"
).replace(/\/+$/, "");
const pinwrenKey = process.env.NEXT_PUBLIC_PINWREN_KEY;

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TripMate - Travel App",
  description:
    "TripMate is a travel app that helps you plan your trips, save your favorite places and share them with your friends. and much more !",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // conditionally render header and footer components
  // to not render on login and register pages
  return (
    <html lang="en">
      <AuthProvider>
        <body
          className={cn(inter.className, {
            "debug-screens": process.env.NODE_ENV === "development",
          })}
        >
          {children}
          {pinwrenKey ? (
            <Script
              src={`${pinwrenUrl}/widget.js`}
              data-project={pinwrenKey}
              strategy="afterInteractive"
            />
          ) : null}
        </body>
      </AuthProvider>
    </html>
  );
}
