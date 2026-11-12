"use client";
import React, { useState, useEffect } from "react";
import { CloudSun, Thermometer, Sun, Wind, Umbrella, Sparkles, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface WeatherWidgetProps {
  destination: string;
  dates?: string;
  className?: string;
}

interface WeatherData {
  tempC: string;
  tempF: string;
  condition: string;
  description: string;
  packingAdvice: string[];
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  destination,
  dates,
  className,
}) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!destination || destination === "Your Trip") return;
    async function loadWeather() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/weather/destination?destination=${encodeURIComponent(destination)}&dates=${encodeURIComponent(
            dates || ""
          )}`
        );
        const data = await res.json();
        if (data.success && data.data) {
          setWeather(data.data);
        }
      } catch (e) {
        console.error("Failed to load weather widget data:", e);
      } finally {
        setLoading(false);
      }
    }
    loadWeather();
  }, [destination, dates]);

  if (!destination || destination === "Your Trip" || (!loading && !weather)) return null;

  return (
    <Card className={`overflow-hidden border border-emerald-100 dark:border-emerald-900/60 bg-gradient-to-r from-emerald-50/80 via-teal-50/50 to-white dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 shadow-sm ${className || ""}`}>
      <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {loading ? (
          <div className="flex items-center gap-2.5 text-xs text-emerald-700 dark:text-emerald-300 py-1">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Fetching seasonal climate forecast for {destination}...</span>
          </div>
        ) : weather ? (
          <>
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-emerald-500 text-white shadow-md shadow-emerald-500/10">
                <CloudSun className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {weather.condition}
                  </span>
                  <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/80 px-2 py-0.5 text-[11px] font-extrabold text-emerald-800 dark:text-emerald-200">
                    {weather.tempC} ({weather.tempF})
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-1">
                  {weather.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-slate-200/80 dark:border-slate-800 pt-2 md:pt-0 md:pl-4 text-xs">
              <div className="flex flex-col gap-1 text-slate-700 dark:text-slate-300">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Packing Advice:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {weather.packingAdvice.map((tip, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg bg-white/90 dark:bg-slate-800 border border-emerald-100 dark:border-slate-700 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:text-slate-200 shadow-2xs"
                    >
                      ✓ {tip}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
