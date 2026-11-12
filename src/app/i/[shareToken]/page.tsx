"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Bot,
  MapPin,
  Calendar,
  Wallet,
  Sparkles,
  BookOpen,
  Share2,
  Copy,
  Check,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PDFDownloadButton from "@/components/PDFDownloadButton";
import dayjs from "dayjs";
import type { StructuredItinerary } from "@/schemas/itinerarySchema";
import ItineraryTimeline from "@/components/ItineraryTimeline";

export default function PublicItineraryPage() {
  const params = useParams();
  const shareToken = params?.shareToken as string;

  const [loading, setLoading] = useState(true);
  const [itineraryItem, setItineraryItem] = useState<any>(null);
  const [error, setError] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [viewMode, setViewMode] = useState<"timeline" | "schedule">("timeline");

  useEffect(() => {
    if (!shareToken) return;
    async function loadShared() {
      setLoading(true);
      try {
        const res = await fetch(`/api/itineraries/public/${shareToken}`);
        const data = await res.json();
        if (data.success && data.data) {
          setItineraryItem(data.data);
        } else {
          setError(data.message || "This shared itinerary is not available.");
        }
      } catch (e) {
        setError("Failed to load shared itinerary.");
      } finally {
        setLoading(false);
      }
    }
    loadShared();
  }, [shareToken]);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Loading shared itinerary...
          </p>
        </div>
      </div>
    );
  }

  if (error || !itineraryItem) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-950/50 mb-4">
          <BookOpen className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Itinerary Not Found
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mb-6">
          {error || "This link may have expired or public sharing was turned off by the author."}
        </p>
        <Link href="/">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2">
            Create Your Own AI Trip <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  const {
    destination = "Trip Plan",
    days,
    budget = "Moderate",
    travelStyle = "Explore",
    activities = [],
    itinerary = "",
    itineraryFormat = "legacy",
  } = itineraryItem;

  const duration =
    days?.to && days?.from ? dayjs(days.to).diff(dayjs(days.from), "day") + 1 : 3;
  const isStructured =
    itineraryFormat === "structured" ||
    (typeof itinerary === "object" && !Array.isArray(itinerary) && "days" in itinerary);

  const rawText = Array.isArray(itinerary)
    ? itinerary.join("\n\n")
    : typeof itinerary === "string"
    ? itinerary
    : "";

  const lines = rawText ? rawText.split("\n") : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/40 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pb-20">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 shadow-md shadow-emerald-500/20">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
              TripMate <span className="text-emerald-600 dark:text-emerald-400">AI</span>
            </span>
            <span className="ml-2 rounded-full bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
              Public View
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopyLink}
            className="rounded-xl h-9 gap-1.5 text-xs font-semibold"
          >
            {copiedLink ? (
              <Check className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <Share2 className="h-3.5 w-3.5" />
            )}
            {copiedLink ? "Copied Link" : "Share"}
          </Button>

          <PDFDownloadButton
            destination={destination}
            dates={
              days?.from ? `${dayjs(days.from).format("MMM D")} - ${dayjs(days.to).format("MMM D, YYYY")}` : "Flexible"
            }
            budget={budget}
            travelStyle={travelStyle}
            activities={activities}
            itineraryData={itinerary}
            variant="outline"
            size="sm"
            className="rounded-xl h-9 text-xs font-semibold"
          />

          <Link href="/planner/ai-generator">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-9 gap-1.5 text-xs font-semibold shadow-sm shadow-emerald-600/20">
              <Sparkles className="h-3.5 w-3.5" /> Plan Your Trip
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="max-w-4xl mx-auto px-6 pt-10 pb-6">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-8 md:p-10 text-white shadow-xl shadow-emerald-900/10 relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="flex flex-wrap items-center gap-2 text-emerald-100 text-xs font-semibold mb-3">
            <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
              <MapPin className="h-3.5 w-3.5" /> Destination
            </span>
            {days?.from && (
              <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                <Calendar className="h-3.5 w-3.5" /> {duration} Days
              </span>
            )}
            <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
              <Wallet className="h-3.5 w-3.5" /> {budget} Budget
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            {destination}
          </h1>

          {activities && activities.length > 0 && (
            <p className="text-sm text-emerald-100 max-w-2xl leading-relaxed">
              Featuring highlights:{" "}
              <span className="font-semibold text-white">
                {activities.join(", ")}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Itinerary Schedule Body */}
      <main className="max-w-4xl mx-auto px-6">
        <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              Complete Day-by-Day Itinerary
            </h2>
            <div className="flex rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setViewMode("timeline")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  viewMode === "timeline" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                Timeline
              </button>
              <button
                type="button"
                onClick={() => setViewMode("schedule")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  viewMode === "schedule" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                Schedule
              </button>
            </div>
          </div>

          <div className="space-y-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {viewMode === "timeline" ? (
              <ItineraryTimeline itineraryData={itinerary} destination={destination} />
            ) : isStructured ? (
              // Structured Itinerary View
              ((itinerary as StructuredItinerary).days || []).map((day: any, idx: number) => {
                const morningActs = (day.activities || []).filter((a: any) => a.timeSlot === "morning");
                const afternoonActs = (day.activities || []).filter((a: any) => a.timeSlot === "afternoon");
                const eveningActs = (day.activities || []).filter((a: any) => a.timeSlot === "evening");
                const hiddenGemAct = (day.activities || []).find((a: any) => a.isHiddenGem);

                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 p-5 space-y-3"
                  >
                    <h3 className="text-base font-bold text-emerald-800 dark:text-emerald-300 border-l-4 border-emerald-500 pl-3">
                      Day {day.day}: {day.theme || day.title} {day.date ? `(${day.date})` : ""}
                    </h3>

                    {morningActs.length > 0 && (
                      <div className="space-y-1 pl-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Morning
                        </span>
                        {morningActs.map((act: any, i: number) => (
                          <div key={i} className="flex gap-2 text-sm">
                            <div>
                              <span className="font-semibold text-slate-900 dark:text-white">{act.title}:</span>{" "}
                              <span>{act.description}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {afternoonActs.length > 0 && (
                      <div className="space-y-1 pl-1 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Afternoon
                        </span>
                        {afternoonActs.map((act: any, i: number) => (
                          <div key={i} className="flex gap-2 text-sm">
                            <div>
                              <span className="font-semibold text-slate-900 dark:text-white">{act.title}:</span>{" "}
                              <span>{act.description}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {eveningActs.length > 0 && (
                      <div className="space-y-1 pl-1 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Evening
                        </span>
                        {eveningActs.map((act: any, i: number) => (
                          <div key={i} className="flex gap-2 text-sm">
                            <div>
                              <span className="font-semibold text-slate-900 dark:text-white">{act.title}:</span>{" "}
                              <span>{act.description}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {hiddenGemAct && (
                      <div className="mt-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 p-3.5 text-xs text-emerald-900 dark:text-emerald-200">
                        <span className="font-bold">✨ Hidden Gem ({hiddenGemAct.title}): </span>
                        <span>{hiddenGemAct.description}</span>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              // Legacy Markdown View
              lines.map((line: string, i: number) => {
                if (!line.trim()) return <div key={i} className="h-2" />;
                if (/^#{1,3}\s*day\s+\d+/i.test(line.trim()) || /^day\s+\d+/i.test(line.trim())) {
                  return (
                    <h3
                      key={i}
                      className="mt-6 border-l-4 border-emerald-500 pl-3 text-base font-bold text-emerald-800 dark:text-emerald-300 first:mt-0"
                    >
                      {line.replace(/^#+\s*/, "")}
                    </h3>
                  );
                }
                if (/^\*\*/.test(line.trim())) {
                  return (
                    <p key={i} className="font-semibold text-slate-900 dark:text-white">
                      {line.replace(/\*\*/g, "")}
                    </p>
                  );
                }
                if (line.trim().startsWith("- ")) {
                  return (
                    <div key={i} className="flex gap-2 py-0.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                      <span>{line.trim().slice(2)}</span>
                    </div>
                  );
                }
                return <p key={i}>{line}</p>;
              })
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
