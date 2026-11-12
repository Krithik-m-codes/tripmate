"use client";
import React from "react";
import { motion } from "framer-motion";
import { Sparkles, MapPin, Wallet, CheckSquare, Heart, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export type EmptyStateVariant = "trips" | "budget" | "checklist" | "saved" | "search" | "default";

interface EmptyStateCardProps {
  variant?: EmptyStateVariant;
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

const VARIANTS: Record<
  EmptyStateVariant,
  {
    icon: React.ReactNode;
    title: string;
    description: string;
    gradient: string;
    badge: string;
  }
> = {
  trips: {
    icon: <MapPin className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />,
    title: "No Itineraries Planned Yet",
    description: "Start exploring the world! Our RAG-powered AI will craft a personalized day-by-day journey tailored to your exact budget and vibe.",
    gradient: "from-emerald-500/10 via-teal-500/5 to-transparent border-emerald-500/20",
    badge: "AI Trip Generator",
  },
  budget: {
    icon: <Wallet className="h-10 w-10 text-amber-600 dark:text-amber-400" />,
    title: "No Expense Data Found",
    description: "Track your flights, accommodations, dining, and activities. Keep your vacation on budget with live currency conversion and pie breakdowns.",
    gradient: "from-amber-500/10 via-orange-500/5 to-transparent border-amber-500/20",
    badge: "Smart Budgeting",
  },
  checklist: {
    icon: <CheckSquare className="h-10 w-10 text-blue-600 dark:text-blue-400" />,
    title: "No Packing Checklists Created",
    description: "Don't leave essentials behind. Auto-generate tailored packing items based on beach resorts, ski trips, or urban walking tours.",
    gradient: "from-blue-500/10 via-indigo-500/5 to-transparent border-blue-500/20",
    badge: "Smart Packing",
  },
  saved: {
    icon: <Heart className="h-10 w-10 text-rose-600 dark:text-rose-400" />,
    title: "No Saved Places Yet",
    description: "Heart your favorite monuments, hidden gems, and restaurants while exploring the map or chatting with our AI to save them here.",
    gradient: "from-rose-500/10 via-pink-500/5 to-transparent border-rose-500/20",
    badge: "Favorites",
  },
  search: {
    icon: <Search className="h-10 w-10 text-purple-600 dark:text-purple-400" />,
    title: "No Results Found",
    description: "We couldn't find any trips matching your search criteria or filters. Try adjusting your keywords or clearing dates.",
    gradient: "from-purple-500/10 via-violet-500/5 to-transparent border-purple-500/20",
    badge: "Search & Filter",
  },
  default: {
    icon: <Sparkles className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />,
    title: "Nothing Here Right Now",
    description: "Get started by generating your first AI trip plan or adding new items to your dashboard.",
    gradient: "from-emerald-500/10 via-slate-500/5 to-transparent border-slate-200 dark:border-slate-800",
    badge: "TripMate AI",
  },
};

export default function EmptyStateCard({
  variant = "default",
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className = "",
}: EmptyStateCardProps) {
  const config = VARIANTS[variant] || VARIANTS.default;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`relative overflow-hidden rounded-3xl border bg-gradient-to-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 md:p-12 text-center shadow-lg ${config.gradient} ${className}`}
    >
      {/* Subtle floating background circles */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/0 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br from-teal-500/10 to-emerald-500/0 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-md space-y-5">
        {/* Animated Icon Container */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white dark:bg-slate-800 shadow-md border border-slate-100 dark:border-slate-700/80"
        >
          {config.icon}
        </motion.div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
          <Sparkles className="h-3 w-3 text-emerald-500" />
          {config.badge}
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h3 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {title || config.title}
          </h3>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {description || config.description}
          </p>
        </div>

        {/* Action Button */}
        {(actionLabel || actionHref) && (
          <div className="pt-2">
            {actionHref ? (
              <Link href={actionHref}>
                <Button className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5 text-xs font-bold text-white shadow-lg shadow-emerald-600/25 hover:scale-105 active:scale-95 transition-all gap-2">
                  <span>{actionLabel || "Get Started"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Button
                onClick={onAction}
                className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5 text-xs font-bold text-white shadow-lg shadow-emerald-600/25 hover:scale-105 active:scale-95 transition-all gap-2"
              >
                <span>{actionLabel || "Get Started"}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
