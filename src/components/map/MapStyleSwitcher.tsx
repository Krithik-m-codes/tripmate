"use client";
import { motion } from "framer-motion";
import { Layers, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MapStyleOption } from "@/lib/mapConfig";
import type { UserPlan } from "@/lib/plan";

interface Props {
  styles: MapStyleOption[];
  currentStyleUrl: string;
  open: boolean;
  onToggle: () => void;
  onSelect: (style: MapStyleOption) => void;
  plan: UserPlan;
}

export function MapStyleSwitcher({
  styles,
  currentStyleUrl,
  open,
  onToggle,
  onSelect,
  plan,
}: Props) {
  const current = styles.find((s) => s.url === currentStyleUrl) ?? styles[0];

  return (
    <div className="absolute bottom-8 left-4 z-20">
      <div className="relative">
        <button
          onClick={onToggle}
          className="flex items-center gap-2 rounded-xl bg-slate-900/80 px-3 py-2.5 text-sm font-medium text-white shadow-lg backdrop-blur-md transition hover:bg-slate-800"
        >
          <Layers className="h-4 w-4" />
          <span>
            {current.emoji} {current.label}
          </span>
        </button>

        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-full mb-2 min-w-[220px] overflow-hidden rounded-xl border border-white/10 bg-slate-900/95 shadow-2xl backdrop-blur-md"
          >
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
              {plan === "pro" ? (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                  <Crown className="h-3.5 w-3.5" />
                  Pro — Mapbox Styles
                </span>
              ) : (
                <span className="text-xs text-slate-400">Free — OpenStreetMap Styles</span>
              )}
            </div>

            {styles.map((style) => (
              <button
                key={style.id}
                onClick={() => onSelect(style)}
                className={cn(
                  "flex w-full items-start gap-3 px-4 py-2.5 text-left text-sm transition-colors",
                  style.url === currentStyleUrl
                    ? "bg-emerald-600/80 text-white"
                    : "text-slate-200 hover:bg-white/10"
                )}
              >
                <span className="mt-0.5 text-base leading-none">{style.emoji}</span>
                <div>
                  <p className="font-medium leading-none">{style.label}</p>
                  <p className="mt-0.5 text-xs opacity-70">{style.description}</p>
                </div>
              </button>
            ))}

            {plan === "free" && (
              <div className="border-t border-white/10 px-4 py-3">
                <p className="text-xs text-slate-400">
                  Upgrade to{" "}
                  <a href="/pricing" className="font-semibold text-amber-400 hover:underline">
                    Pro
                  </a>{" "}
                  for satellite & 6 map styles.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
