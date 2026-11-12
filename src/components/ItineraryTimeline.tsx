"use client";
import React, { useState } from "react";
import {
  Clock,
  MapPin,
  DollarSign,
  Sparkles,
  Sun,
  Sunset,
  Moon,
  Calendar,
  Compass,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { isStructuredItinerary, type StructuredItinerary, type Activity } from "@/schemas/itinerarySchema";

interface ItineraryTimelineProps {
  itineraryData: StructuredItinerary | string | any;
  destination?: string;
}

const SLOT_ICONS: Record<string, React.ReactNode> = {
  morning: <Sun className="h-4 w-4 text-amber-500" />,
  afternoon: <Sunset className="h-4 w-4 text-emerald-500" />,
  evening: <Moon className="h-4 w-4 text-indigo-500" />,
};

const SLOT_BADGES: Record<string, string> = {
  morning: "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  afternoon: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  evening: "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
};

export default function ItineraryTimeline({ itineraryData, destination }: ItineraryTimelineProps) {
  const [collapsedDays, setCollapsedDays] = useState<Record<number, boolean>>({});

  const toggleDay = (dayNum: number) => {
    setCollapsedDays((prev) => ({ ...prev, [dayNum]: !prev[dayNum] }));
  };

  const isStructured = isStructuredItinerary(itineraryData) || (typeof itineraryData === "object" && itineraryData?.days);

  if (!itineraryData) {
    return <div className="p-4 text-center text-xs text-slate-400">No timeline data available.</div>;
  }

  if (isStructured) {
    const structured = itineraryData as StructuredItinerary;
    const days = structured.days || [];

    return (
      <div className="space-y-6 py-2">
        {days.map((day, idx) => {
          const isCollapsed = collapsedDays[day.day];
          const activities = day.activities || [];

          return (
            <div key={idx} className="relative">
              {/* Day Header Node */}
              <div
                onClick={() => toggleDay(day.day)}
                className="group flex items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-600/90 to-teal-600/90 text-white shadow-md cursor-pointer hover:opacity-95 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 font-extrabold text-base backdrop-blur-sm">
                    {day.day}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <span>Day {day.day}: {day.theme || "Exploration & Discovery"}</span>
                    </h3>
                    {day.date && <p className="text-xs text-emerald-100 font-medium">{day.date}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold bg-black/20 px-2.5 py-1 rounded-full">
                    {activities.length} {activities.length === 1 ? "stop" : "stops"}
                  </span>
                  <div className="p-1 rounded-lg bg-white/10">
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </div>
              </div>

              {/* Day Timeline Branch */}
              {!isCollapsed && (
                <div className="relative ml-5 border-l-2 border-emerald-500/30 dark:border-emerald-500/20 pl-6 pt-4 pb-2 space-y-4">
                  {activities.length === 0 ? (
                    <p className="text-xs italic text-slate-400">No scheduled activities for this day.</p>
                  ) : (
                    activities.map((act: Activity, aIdx: number) => {
                      const slotIcon = SLOT_ICONS[act.timeSlot] || <Clock className="h-4 w-4 text-emerald-500" />;
                      const slotBadge = SLOT_BADGES[act.timeSlot] || "bg-slate-100 text-slate-700";

                      return (
                        <div key={act.id || aIdx} className="relative group">
                          {/* Node indicator dot */}
                          <div className="absolute -left-[31px] top-4 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-900 bg-emerald-500 group-hover:scale-125 transition-transform shadow-sm" />

                          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4 shadow-sm hover:shadow-md transition-all space-y-2">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wider ${slotBadge}`}>
                                  {slotIcon}
                                  {act.timeSlot}
                                </span>
                                <span className="text-xs font-bold text-slate-900 dark:text-white">{act.title}</span>
                              </div>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 capitalize">
                                {act.category}
                              </span>
                            </div>

                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{act.description}</p>

                            {act.isHiddenGem && (
                              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold">
                                ✨ Hidden Gem Highlight
                              </div>
                            )}

                            <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                              {act.duration && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-emerald-600 shrink-0" /> {act.duration}
                                </span>
                              )}
                              {act.location?.name && (
                                <span className="flex items-center gap-1 line-clamp-1">
                                  <MapPin className="h-3 w-3 text-emerald-600 shrink-0" /> {act.location.name}
                                </span>
                              )}
                              {act.estimatedCost && typeof act.estimatedCost.amount === "number" && (
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3 text-emerald-600 shrink-0" /> ${act.estimatedCost.amount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Legacy Plain Text Timeline Parsing
  const rawText = typeof itineraryData === "string" ? itineraryData : Array.isArray(itineraryData) ? itineraryData.join("\n\n") : JSON.stringify(itineraryData, null, 2);
  const dayBlocks = rawText.split(/(?=^#{1,3}\s*day\s+\d+|^day\s+\d+)/im).filter((b) => b.trim());

  return (
    <div className="space-y-6 py-2">
      {dayBlocks.map((block, idx) => {
        const lines = block.split("\n").filter((l) => l.trim());
        const headerLine = lines[0] || `Day ${idx + 1}`;
        const contentLines = lines.slice(1);

        return (
          <div key={idx} className="relative">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-sm shadow-sm">
              <Calendar className="h-4 w-4 shrink-0" />
              <span>{headerLine.replace(/^#+\s*/, "")}</span>
            </div>
            <div className="relative ml-5 border-l-2 border-emerald-500/30 pl-6 pt-3 pb-2 space-y-3">
              {contentLines.map((line, lIdx) => (
                <div key={lIdx} className="relative">
                  <div className="absolute -left-[31px] top-2 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-slate-900 bg-emerald-500" />
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{line.replace(/^[-*]\s*/, "")}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
