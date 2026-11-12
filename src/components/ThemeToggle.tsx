"use client";

import React from "react";
import { useTheme } from "@/context/ThemeProvider";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all duration-200 border border-zinc-200/80 dark:border-white/10 shadow-xs flex items-center justify-center active:scale-95"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-emerald-400 animate-spin-slow" />
      ) : (
        <Moon className="w-4 h-4 text-emerald-600" />
      )}
    </button>
  );
}
