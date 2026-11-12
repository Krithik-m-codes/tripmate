"use client";

import React, { useState } from "react";
import {
  Cpu,
  Sparkles,
  Zap,
  Clock,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MapPin,
  Calendar,
  Wallet,
  ArrowRight,
  Loader2,
  Save,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/authClient";
import { triggerSuccessBurst } from "@/lib/confetti";
import ItineraryTimeline from "@/components/ItineraryTimeline";

export default function ModelCompareStudioPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [destination, setDestination] = useState("Tokyo, Japan");
  const [days, setDays] = useState("3");
  const [budget, setBudget] = useState("Moderate");
  const [travelStyle, setTravelStyle] = useState("Culture & Foodie");
  const [prompt, setPrompt] = useState("Include authentic ramen bars, Senso-ji temple at sunrise, and hidden izakayas.");

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [selectedPreviewTab, setSelectedPreviewTab] = useState<Record<string, "summary" | "timeline">>({});

  const quickPrompts = [
    {
      label: "🍣 3 Days Tokyo Culture",
      dest: "Tokyo, Japan",
      days: "3",
      budget: "Moderate",
      style: "Culture & Foodie",
      p: "Focus on traditional shrines, Akihabara tech district, and secret sushi alleys.",
    },
    {
      label: "🍋 4 Days Amalfi Coast",
      dest: "Amalfi Coast, Italy",
      days: "4",
      budget: "Luxury",
      style: "Luxury & Comfort",
      p: "Include cliffside dining, private boat tours to Capri, and relaxing lemon groves.",
    },
    {
      label: "🌋 3 Days Reykjavik Adventure",
      dest: "Reykjavik, Iceland",
      days: "3",
      budget: "Moderate",
      style: "Adventure & Nature",
      p: "Plan for Golden Circle waterfalls, glacier hiking, and soothing thermal lagoons.",
    },
  ];

  const handleRunComparison = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!destination.trim()) {
      toast.error("Please enter a destination");
      return;
    }

    setLoading(true);
    setResults(null);
    try {
      const res = await fetch("/api/itineraries/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          days: parseInt(days) || 3,
          budget,
          travelStyle,
          prompt,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setResults(data.data);
        toast.success(`Benchmarked ${data.data.length} models in ${(data.totalDurationMs / 1000).toFixed(1)}s!`);
      } else {
        toast.error(data.message || "Benchmark failed");
      }
    } catch (err: any) {
      toast.error("Failed to run AI model comparison");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWinner = async (modelResult: any) => {
    if (!session?.user) {
      toast.error("Please sign in to save trip itineraries");
      return;
    }

    setSavingId(modelResult.id);
    try {
      const res = await fetch("/api/itineraries/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          itinerary: modelResult.itinerary,
          isStructured: true,
          modelProvider: modelResult.provider,
        }),
      });

      const data = await res.json();
      if (data.success) {
        triggerSuccessBurst();
        toast.success(`Saved ${modelResult.name}'s winning itinerary!`);
        router.push("/planner/recent");
      } else {
        toast.error(data.message || "Failed to save itinerary");
      }
    } catch (e) {
      toast.error("Error saving winning itinerary");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pb-20 px-6 pt-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Cpu className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  AI Model Comparison Studio
                </h1>
                <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  Phase 5 Benchmark
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Run parallel prompts across Gemini, NVIDIA NIM, and OpenRouter to compare speed, tokens, cost, and creative quality side-by-side.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Quick Test:</span>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((qp, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setDestination(qp.dest);
                    setDays(qp.days);
                    setBudget(qp.budget);
                    setTravelStyle(qp.style);
                    setPrompt(qp.p);
                  }}
                  className="px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all shadow-xs"
                >
                  {qp.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input Control Form */}
        <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-xl p-6 md:p-8">
          <form onSubmit={handleRunComparison} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-emerald-600" /> Destination
                </label>
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Kyoto, Japan"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-emerald-600" /> Duration (Days)
                </label>
                <select
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                >
                  {[1, 2, 3, 4, 5, 7].map((d) => (
                    <option key={d} value={d}>
                      {d} Day{d > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Wallet className="h-3.5 w-3.5 text-emerald-600" /> Budget Level
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                >
                  <option value="Budget">Budget ($ - Backpacking)</option>
                  <option value="Moderate">Moderate ($$ - Balanced)</option>
                  <option value="Luxury">Luxury ($$$ - Premium)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Travel Vibe
                </label>
                <select
                  value={travelStyle}
                  onChange={(e) => setTravelStyle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                >
                  <option value="Culture & Foodie">Culture & Foodie</option>
                  <option value="Adventure & Nature">Adventure & Nature</option>
                  <option value="Relaxation & Beach">Relaxation & Beach</option>
                  <option value="Luxury & Comfort">Luxury & Comfort</option>
                  <option value="Family Friendly">Family Friendly</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Custom Instructions / Highlights
              </label>
              <textarea
                rows={2}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Specific preferences, dietary restrictions, landmark desires..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ⚡ Simultaneous multi-agent evaluation over structured JSON schema.
              </p>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-2xl h-11 px-8 gap-2 shadow-lg shadow-emerald-600/25 transition-all active:scale-95"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Running Parallel Benchmarks...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-white" />
                    Launch Benchmark Studio
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* Results Grid */}
        {loading && (
          <div className="py-16 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shadow-inner animate-bounce">
              <Cpu className="w-8 h-8 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Evaluating AI Models Simultaneously...
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                We are streaming structured responses from Google Gemini, NVIDIA NIM Llama 3.1, and OpenRouter in real-time to compute accuracy, speed, and token cost.
              </p>
            </div>
          </div>
        )}

        {results && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-500">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                Benchmark Results & Side-by-Side Comparison
              </h2>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Select your favorite itinerary below to save it directly to your trip collection
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {results.map((res, index) => {
                const isSuccess = res.status === "success" && res.itinerary;
                const tab = selectedPreviewTab[res.id] || "summary";

                return (
                  <Card
                    key={res.id || index}
                    className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden flex flex-col justify-between hover:border-emerald-500/50 transition-all"
                  >
                    <div>
                      {/* Card Header Bar */}
                      <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                            {res.badge}
                          </span>
                          <h3 className="text-base font-black text-slate-900 dark:text-white mt-1.5">
                            {res.name}
                          </h3>
                        </div>
                        {isSuccess ? (
                          <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" /> Ready
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-xs font-bold text-rose-500">
                            <AlertCircle className="w-4 h-4" /> Error
                          </div>
                        )}
                      </div>

                      {/* Performance Metrics Bar */}
                      <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-800 border-b border-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 text-center py-3 text-xs font-semibold">
                        <div className="px-2">
                          <span className="text-[10px] uppercase text-slate-400 block flex items-center justify-center gap-1">
                            <Clock className="w-3 h-3 text-blue-500" /> Latency
                          </span>
                          <span className="text-slate-800 dark:text-slate-200 font-bold">
                            {(res.durationMs / 1000).toFixed(2)}s
                          </span>
                        </div>
                        <div className="px-2">
                          <span className="text-[10px] uppercase text-slate-400 block flex items-center justify-center gap-1">
                            <Zap className="w-3 h-3 text-amber-500" /> Tokens
                          </span>
                          <span className="text-slate-800 dark:text-slate-200 font-bold">
                            {res.totalTokens ? `${res.totalTokens} t` : "N/A"}
                          </span>
                        </div>
                        <div className="px-2">
                          <span className="text-[10px] uppercase text-slate-400 block flex items-center justify-center gap-1">
                            <DollarSign className="w-3 h-3 text-emerald-500" /> Est. Cost
                          </span>
                          <span className="text-slate-800 dark:text-slate-200 font-bold">
                            {res.estimatedCost ? `$${res.estimatedCost}` : "$0.00"}
                          </span>
                        </div>
                      </div>

                      {/* Content Preview area */}
                      <div className="p-5 space-y-4">
                        {isSuccess ? (
                          <>
                            {/* Tab Switcher */}
                            <div className="flex rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-1 text-xs font-bold">
                              <button
                                type="button"
                                onClick={() => setSelectedPreviewTab({ ...selectedPreviewTab, [res.id]: "summary" })}
                                className={`flex-1 py-1 rounded-lg transition-all ${
                                  tab === "summary" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                                }`}
                              >
                                Summary
                              </button>
                              <button
                                type="button"
                                onClick={() => setSelectedPreviewTab({ ...selectedPreviewTab, [res.id]: "timeline" })}
                                className={`flex-1 py-1 rounded-lg transition-all ${
                                  tab === "timeline" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                                }`}
                              >
                                Timeline Preview
                              </button>
                            </div>

                            {tab === "summary" ? (
                              <div className="space-y-3 max-h-80 overflow-y-auto pr-1 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                <p className="font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50/70 dark:bg-emerald-950/40 p-3 rounded-2xl border border-emerald-500/20">
                                  {res.itinerary.summary || res.itinerary.title || "Custom AI Trip Itinerary"}
                                </p>
                                <div className="space-y-2">
                                  {(res.itinerary.days || []).slice(0, 3).map((day: any, dIdx: number) => (
                                    <div key={dIdx} className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3 border border-slate-100 dark:border-slate-800/80">
                                      <p className="font-bold text-slate-900 dark:text-white text-xs">
                                        Day {day.day}: {day.theme || `Exploring ${destination}`}
                                      </p>
                                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                                        {(day.activities || []).map((a: any) => a.title).join(" • ")}
                                      </p>
                                    </div>
                                  ))}
                                  {(res.itinerary.days || []).length > 3 && (
                                    <p className="text-center text-xs font-semibold text-slate-400 pt-1">
                                      + {(res.itinerary.days || []).length - 3} more full days generated
                                    </p>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="max-h-80 overflow-y-auto pr-1">
                                <ItineraryTimeline itineraryData={res.itinerary} destination={destination} />
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="py-12 text-center space-y-2">
                            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                              Evaluation Error
                            </p>
                            <p className="text-xs text-slate-400 max-w-xs mx-auto">
                              {res.error || "Provider API key rate-limited or unavailable."}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Footer Action */}
                    <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/20">
                      <Button
                        type="button"
                        disabled={!isSuccess || savingId === res.id}
                        onClick={() => handleSaveWinner(res)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl h-10 gap-2 shadow-sm text-xs transition-all active:scale-95"
                      >
                        {savingId === res.id ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving Winner...
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5" /> Pick & Save Winner
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
