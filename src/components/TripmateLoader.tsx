"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Plane, Sparkles, MapPin, Globe } from "lucide-react";

const TRAVEL_MESSAGES = [
  "Gathering hidden gems & local secrets…",
  "Optimizing scenic travel routes…",
  "Curating top-rated experiences…",
  "Aligning weather forecasts & schedules…",
  "Crafting your dream itinerary…",
];

interface TripmateLoaderProps {
  size?: "sm" | "md" | "lg" | "fullscreen";
  message?: string;
  submessage?: string;
  className?: string;
}

export function TripmateLoader({
  size = "fullscreen",
  message,
  submessage,
  className = "",
}: TripmateLoaderProps) {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    if (message) return; // If explicit message passed, do not rotate
    const interval = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % TRAVEL_MESSAGES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [message]);

  const displayMessage = message || TRAVEL_MESSAGES[msgIdx];

  // Small inline variant
  if (size === "sm") {
    return (
      <div className={`flex items-center gap-2 text-emerald-600 dark:text-emerald-400 ${className}`}>
        <div className="relative flex h-5 w-5 items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-emerald-500/30 border-t-emerald-500"
          />
          <Plane className="h-2.5 w-2.5" />
        </div>
        {displayMessage && <span className="text-xs font-semibold">{displayMessage}</span>}
      </div>
    );
  }

  // Medium / Card variant
  if (size === "md" || size === "lg") {
    const cardSize = size === "lg" ? "p-8 max-w-sm" : "p-6 max-w-xs";
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <div
          className={`relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-emerald-500/10 text-center ${cardSize} w-full`}
        >
          {/* Ambient background glow */}
          <div className="absolute -top-12 -left-12 h-32 w-32 rounded-full bg-emerald-500/15 blur-2xl animate-pulse" />
          <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-teal-500/15 blur-2xl animate-pulse" />

          {/* Orbiting Plane & Compass Animation */}
          <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-dashed border-emerald-500/40"
            >
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 dark:bg-emerald-400 p-1 text-white dark:text-slate-950 shadow-md">
                <Plane className="h-3 w-3 rotate-45" />
              </div>
            </motion.div>

            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 rounded-full border border-teal-500/20"
            />

            <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-600/30 text-white">
              <Compass className="h-6 w-6 animate-pulse" />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={displayMessage}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight"
            >
              {displayMessage}
            </motion.p>
          </AnimatePresence>

          {submessage && (
            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{submessage}</p>
          )}

          <div className="mt-5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 h-1.5 w-full">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="h-full w-1/2 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 rounded-full"
            />
          </div>
        </div>
      </div>
    );
  }

  // Fullscreen variant (Default)
  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-50/90 dark:bg-[#050505]/90 backdrop-blur-md transition-colors duration-300 ${className}`}>
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-transparent blur-3xl animate-pulse" />
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 flex flex-col items-center max-w-md px-6 text-center"
      >
        {/* Orbit container */}
        <div className="relative mb-8 flex h-32 w-32 items-center justify-center">
          {/* Outer Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-dashed border-emerald-500/40"
          >
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 p-1.5 text-white shadow-lg shadow-emerald-500/40">
              <Plane className="h-4 w-4 rotate-45" />
            </div>
          </motion.div>

          {/* Middle Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 rounded-full border border-slate-300 dark:border-slate-800"
          >
            <div className="absolute top-0 right-1 rounded-full bg-teal-500/80 p-1 text-white">
              <MapPin className="h-2.5 w-2.5" />
            </div>
          </motion.div>

          {/* Inner Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute inset-8 rounded-full border border-emerald-500/20"
          />

          {/* Center Icon */}
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 shadow-xl shadow-emerald-500/30 text-white">
            <Globe className="h-8 w-8 animate-pulse" />
            <Sparkles className="absolute -top-1.5 -right-1.5 h-4 w-4 text-amber-300 animate-bounce" />
          </div>
        </div>

        {/* Brand Title */}
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <span>Tripmate</span>
          <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            AI Travel
          </span>
        </h2>

        {/* Dynamic Animated Status Text */}
        <div className="h-6 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={displayMessage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-semibold text-slate-600 dark:text-slate-300"
            >
              {displayMessage}
            </motion.p>
          </AnimatePresence>
        </div>

        {submessage && (
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{submessage}</p>
        )}

        {/* Shimmer Progress bar */}
        <div className="mt-6 w-48 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800/80 h-1.5">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="h-full w-1/2 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 rounded-full shadow-sm"
          />
        </div>
      </motion.div>
    </div>
  );
}

export default TripmateLoader;
