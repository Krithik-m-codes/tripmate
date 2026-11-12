"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, Compass } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

interface AuthLayoutShellProps {
  children: React.ReactNode;
  badge?: string;
  title: string;
  subtitle: string;
}

export default function AuthLayoutShell({
  children,
  badge = "Welcome",
  title,
  subtitle,
}: AuthLayoutShellProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-[#FAFAFA] dark:bg-[#09090B] transition-colors duration-300 font-sans">
      {/* Left Editorial Travel Showcase (Hidden on Mobile, 5 Cols on Desktop) */}
      <div className="hidden lg:flex lg:col-span-5 xl:col-span-6 flex-col justify-between relative overflow-hidden bg-[#121413] p-12 lg:p-16 text-white border-r border-zinc-200/40 dark:border-zinc-800/80">
        {/* Subtle, Warm Editorial Background Image overlay */}
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80"
            alt="Scenic Travel"
            fill
            className="object-cover object-center scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121413] via-[#121413]/60 to-transparent" />
        </div>

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
            <Image
              src="/tripmate-logo.png"
              alt="TripMate"
              width={34}
              height={34}
              className="rounded-lg shadow-sm"
            />
            <span className="font-heading font-bold text-xl tracking-tight text-white">TripMate</span>
          </Link>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-medium text-zinc-300 border border-white/10">
            <Compass className="h-3.5 w-3.5 text-zinc-300" />
            Travel Companion
          </span>
        </div>

        {/* Center Editorial Quote & Philosophy */}
        <div className="relative z-10 my-auto py-12 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <p className="font-heading text-2xl lg:text-3xl font-light tracking-tight text-zinc-100 leading-snug">
              &ldquo;The real voyage of discovery consists not in seeking new landscapes, but in having new eyes.&rdquo;
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="h-0.5 w-8 bg-zinc-500" />
              <span className="text-xs font-medium tracking-widest uppercase text-zinc-400">
                Marcel Proust
              </span>
            </div>
          </motion.div>
        </div>

        {/* Bottom Subtle Footer */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
          <p>Curated itineraries & tranquil maps.</p>
          <p>&copy; {new Date().getFullYear()} TripMate</p>
        </div>
      </div>

      {/* Right Column: Subtle, Clean Form Area */}
      <div className="lg:col-span-7 xl:col-span-6 flex flex-col justify-between bg-white dark:bg-[#09090B] relative transition-colors duration-300 min-h-screen">
        {/* Top Header */}
        <header className="flex items-center justify-between px-6 py-6 md:px-12 border-b border-zinc-100 dark:border-zinc-900/80 lg:border-none">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Back to homepage</span>
          </Link>

          {/* Mobile Logo visibility */}
          <Link href="/" className="lg:hidden flex items-center gap-2">
            <Image src="/tripmate-logo.png" alt="TripMate" width={24} height={24} className="rounded-md" />
            <span className="font-heading font-bold text-base text-zinc-900 dark:text-white">TripMate</span>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </header>

        {/* Main Form Container */}
        <main className="flex-1 flex items-center justify-center px-6 py-12 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-[400px]"
          >
            {/* Title & Subtitle Header */}
            <div className="mb-8">
              {badge && (
                <span className="inline-block text-xs font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase mb-2">
                  {badge}
                </span>
              )}
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
                {title}
              </h1>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {subtitle}
              </p>
            </div>

            {/* Form Content */}
            <div className="space-y-6">
              {children}
            </div>
          </motion.div>
        </main>

        {/* Right Column Footer */}
        <footer className="px-6 py-6 md:px-12 border-t border-zinc-100 dark:border-zinc-900/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400 dark:text-zinc-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-zinc-400 shrink-0" />
            <span>Secure & confidential session</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
              Privacy
            </Link>
            <Link href="/" className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
              Terms
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
