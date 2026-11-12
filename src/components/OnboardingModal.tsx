"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Compass,
  DollarSign,
  CheckCircle2,
  ArrowRight,
  X,
  Palmtree,
  Building2,
  Utensils,
  Backpack,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const TRAVEL_VIBES = [
  { id: "adventure", label: "Adventure & Nature", icon: <Palmtree className="h-6 w-6 text-emerald-600" />, desc: "Hiking, outdoor sports, national parks, and thrill-seeking." },
  { id: "luxury", label: "Luxury & Comfort", icon: <Building2 className="h-6 w-6 text-amber-600" />, desc: "5-star resorts, private transfers, fine dining, and relaxation." },
  { id: "culture", label: "Culture & Foodie", icon: <Utensils className="h-6 w-6 text-purple-600" />, desc: "Street food markets, historic monuments, museums, and local life." },
  { id: "budget", label: "Budget & Backpacking", icon: <Backpack className="h-6 w-6 text-blue-600" />, desc: "Hostels, public transit, free walking tours, and smart savings." },
];

const CURRENCIES = [
  { code: "USD", symbol: "$", label: "US Dollar (USD - $)" },
  { code: "EUR", symbol: "€", label: "Euro (EUR - €)" },
  { code: "GBP", symbol: "£", label: "British Pound (GBP - £)" },
  { code: "JPY", symbol: "¥", label: "Japanese Yen (JPY - ¥)" },
  { code: "AUD", symbol: "A$", label: "Australian Dollar (AUD - A$)" },
  { code: "CAD", symbol: "C$", label: "Canadian Dollar (CAD - C$)" },
  { code: "INR", symbol: "₹", label: "Indian Rupee (INR - ₹)" },
];

export default function OnboardingModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);

  // User preferences state
  const [selectedVibe, setSelectedVibe] = useState("culture");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [homeCity, setHomeCity] = useState("");

  useEffect(() => {
    // Check if user has already completed onboarding
    const done = localStorage.getItem("tripmate_onboarding_done");
    if (!done) {
      // Delay slightly so the page finishes loading
      const timer = setTimeout(() => setOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleFinish = (redirectToPlanner = true) => {
    localStorage.setItem("tripmate_onboarding_done", "true");
    localStorage.setItem("tripmate_pref_vibe", selectedVibe);
    localStorage.setItem("tripmate_pref_currency", selectedCurrency);
    if (homeCity.trim()) localStorage.setItem("tripmate_pref_home", homeCity.trim());

    setOpen(false);
    if (redirectToPlanner) {
      router.push("/planner/ai-generator");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-6 text-white relative">
          <button
            type="button"
            onClick={() => handleFinish(false)}
            className="absolute top-4 right-4 p-1 rounded-full bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">Step {step} of 3</span>
          </div>
          <h2 className="text-xl font-extrabold">Welcome to TripMate AI!</h2>
          <p className="text-xs text-emerald-100/90 mt-1">
            Let&apos;s personalize your AI trip planner in just a few quick clicks.
          </p>
        </div>

        <div className="p-6 space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Compass className="h-4 w-4 text-emerald-600" /> What is your primary travel style?
              </h3>
              <div className="grid grid-cols-1 gap-2.5">
                {TRAVEL_VIBES.map((vibe) => (
                  <button
                    key={vibe.id}
                    type="button"
                    onClick={() => setSelectedVibe(vibe.id)}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                      selectedVibe === vibe.id
                        ? "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 shadow-sm"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">{vibe.icon}</div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{vibe.label}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{vibe.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              <Button
                onClick={() => setStep(2)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-10 text-xs font-semibold gap-1.5 shadow-md shadow-emerald-600/20 mt-2"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 text-emerald-600" /> Default Currency & Home City
              </h3>
              
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">Preferred Currency</label>
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">
                  Home City / Departure Hub (Optional)
                </label>
                <Input
                  placeholder="e.g. New York (JFK) or London"
                  value={homeCity}
                  onChange={(e) => setHomeCity(e.target.value)}
                  className="rounded-xl text-xs h-10"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Helps AI recommend realistic flight times and travel advice.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-xl h-10 text-xs font-semibold"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-10 text-xs font-semibold gap-1.5 shadow-md shadow-emerald-600/20"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 text-center py-2">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shadow-inner">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">You&apos;re All Set for Adventure!</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-1">
                  Your preferences have been saved. Our AI is ready to map out your next unforgettable trip.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-3.5 border border-slate-100 dark:border-slate-800 text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Travel Style:</span>
                  <span className="font-bold text-slate-900 dark:text-white capitalize">{selectedVibe}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Currency:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedCurrency}</span>
                </div>
                {homeCity && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Home Base:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{homeCity}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-1">
                <Button
                  onClick={() => handleFinish(true)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-10 text-xs font-semibold gap-1.5 shadow-md shadow-emerald-600/20"
                >
                  <Sparkles className="h-4 w-4" /> Start AI Trip Planner
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleFinish(false)}
                  className="w-full rounded-xl h-9 text-xs text-slate-500 hover:text-slate-800"
                >
                  Go to Dashboard Instead
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
