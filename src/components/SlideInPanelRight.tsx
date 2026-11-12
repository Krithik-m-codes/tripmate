"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchTravelData } from "@/lib/fetchTravelData";

interface SlideInResultsProps {
  lat: number;
  lon: number;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  setPlaces: (places: any[]) => void;
}

const SlideInResults: React.FC<SlideInResultsProps> = ({
  lat,
  lon,
  visible,
  setVisible,
  setPlaces,
}) => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [type, setType] = useState("restaurants");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const results = await fetchTravelData(type, lat, lon);
        setData(results);
        setPlaces(results);
        setError(null);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching travel data:", err);
        setError("Failed to fetch data. Please try again.");
        setData([]);
        setPlaces([]);
      }
    };

    if (lat && lon && visible) {
      fetchData();
    }
  }, [lat, lon, type, visible, setPlaces]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: "0%" }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 w-full sm:w-2/3 lg:w-1/3 h-full bg-white dark:bg-slate-900 rounded-l-2xl shadow-2xl p-6 overflow-y-auto z-50 border-l border-slate-200 dark:border-slate-800"
        >
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Places Nearby</h2>
            <button
              onClick={() => setVisible(false)}
              className="px-3 py-1 text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
          </div>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setType("restaurants")}
              className={`flex-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                type === "restaurants"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              Restaurants
            </button>
            <button
              onClick={() => setType("attractions")}
              className={`flex-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                type === "attractions"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              Attractions
            </button>
          </div>

          {error && <p className="text-sm text-red-500 mb-4 font-medium">{error}</p>}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
              <p className="text-sm text-slate-500">Searching open places around location...</p>
            </div>
          ) : data.length === 0 && !error ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              <p className="text-sm text-slate-500 font-medium">
                No places found right now. Try changing category or moving the map pin.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.map((item, index) =>
                item && item.name ? (
                  <div
                    key={index}
                    className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs bg-white dark:bg-slate-900 hover:border-emerald-500 transition-all"
                  >
                    <h3 className="font-bold text-slate-800 dark:text-white mb-1">{item.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      {item.address || "Address not specified"}
                    </p>
                    {item.web_url && (
                      <a
                        href={item.web_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        View details &rarr;
                      </a>
                    )}
                  </div>
                ) : null
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SlideInResults;
