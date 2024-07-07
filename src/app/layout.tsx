import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import AuthProvider from "../context/AuthProvider";

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
  return (
    <html lang="en">
      <AuthProvider>
        <body
          className={cn(inter.className, {
            "debug-screens": process.env.NODE_ENV === "development",
          })}
        >
          {children}
        </body>
      </AuthProvider>
    </html>
  );
}
