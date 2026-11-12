"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, MapPin, Wallet, CheckSquare, LayoutDashboard } from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Plan AI", href: "/planner/ai-generator", icon: <Sparkles className="h-5 w-5" /> },
    { label: "Trips", href: "/planner/recent", icon: <MapPin className="h-5 w-5" /> },
    { label: "Budget", href: "/planner/budget", icon: <Wallet className="h-5 w-5" /> },
    { label: "Packing", href: "/planner/checklist", icon: <CheckSquare className="h-5 w-5" /> },
    { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 shadow-2xl px-2 py-1.5 transition-all">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                isActive
                  ? "text-emerald-600 dark:text-emerald-400 scale-105 font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? "bg-emerald-50 dark:bg-emerald-950/80 shadow-xs" : "bg-transparent"
                }`}
              >
                {item.icon}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
