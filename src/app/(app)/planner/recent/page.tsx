"use client";
import React, { useState, useEffect } from "react";
import Component from "@/components/ItineraryCard";
import { useSession } from "@/lib/authClient";
import { Loader2, BookOpen, Bot, Search, Filter, ChevronLeft, ChevronRight, Database, WifiOff } from "lucide-react";
import { motion } from "framer-motion";
import { useGetItinerariesQuery, useDeleteItineraryMutation } from "@/store/api/itineraryApi";
import { toast } from "react-toastify";
import EmptyStateCard from "@/components/ui/EmptyStateCard";
import { cacheItinerariesOffline, getOfflineItineraries } from "@/lib/offlineSync";

const RecentItinerariesPage = () => {
  const { data: session } = useSession();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("");
  const [styleFilter, setStyleFilter] = useState("");

  const [offlineCachedItineraries, setOfflineCachedItineraries] = useState<any[]>([]);
  const [isServingOffline, setIsServingOffline] = useState(false);

  const { data, isLoading, isFetching, isError } = useGetItinerariesQuery({
    page,
    limit: 6,
    search: search.trim() || undefined,
    budget: budgetFilter || undefined,
    travelStyle: styleFilter || undefined,
  });

  // Automatically cache fetched itineraries into IndexedDB whenever online
  useEffect(() => {
    if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
      cacheItinerariesOffline(data.data);
      setIsServingOffline(false);
    }
  }, [data]);

  // If offline or query fails due to network, load from IndexedDB
  useEffect(() => {
    async function checkOfflineFallback() {
      if (typeof window !== "undefined" && (!navigator.onLine || isError)) {
        const cached = await getOfflineItineraries();
        if (cached?.data && Array.isArray(cached.data)) {
          setOfflineCachedItineraries(cached.data);
          setIsServingOffline(true);
        }
      }
    }
    checkOfflineFallback();
  }, [isError, isLoading]);

  const [deleteItinerary] = useDeleteItineraryMutation();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this trip itinerary?")) return;
    try {
      await deleteItinerary(id).unwrap();
      toast.success("Itinerary removed");
    } catch (e: any) {
      toast.error("Failed to delete itinerary");
    }
  };

  const fetchedItineraries = data?.data || [];
  const itineraries = isServingOffline ? offlineCachedItineraries : fetchedItineraries;
  const pagination = data?.pagination as any || { page: 1, totalPages: 1, total: itineraries.length };
  const totalPages = pagination.totalPages || pagination.pages || 1;

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-emerald-50/40 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* Page header & Filters */}
      <div className="border-b border-emerald-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-6 py-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Saved Itineraries</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Your AI-generated trip plans & schedules</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search destination..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-3 flex-wrap text-xs font-medium">
          <span className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </span>
          <select
            value={budgetFilter}
            onChange={(e) => { setBudgetFilter(e.target.value); setPage(1); }}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Budgets</option>
            <option value="Budget">Budget</option>
            <option value="Moderate">Moderate</option>
            <option value="Luxury">Luxury</option>
          </select>

          <select
            value={styleFilter}
            onChange={(e) => { setStyleFilter(e.target.value); setPage(1); }}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Travel Styles</option>
            <option value="Relaxed">Relaxed</option>
            <option value="Fast-Paced">Fast-Paced</option>
            <option value="Adventure">Adventure</option>
            <option value="Cultural">Cultural</option>
            <option value="Foodie">Foodie</option>
          </select>

          {(search || budgetFilter || styleFilter) && (
            <button
              onClick={() => { setSearch(""); setBudgetFilter(""); setStyleFilter(""); setPage(1); }}
              className="text-emerald-600 dark:text-emerald-400 hover:underline ml-1"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto px-6 py-6">
        {isServingOffline && (
          <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-50 dark:bg-amber-950/40 p-4 flex items-center justify-between text-amber-800 dark:text-amber-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Offline Storage Active</p>
                <p className="text-xs">Showing {itineraries.length} trip itineraries retrieved directly from local IndexedDB cache.</p>
              </div>
            </div>
            <span className="text-[11px] font-semibold bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-300 px-2.5 py-1 rounded-full">
              PWA Cached
            </span>
          </div>
        )}

        {isLoading || isFetching ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600 dark:text-emerald-400" />
          </div>
        ) : itineraries.length === 0 ? (
          <div className="max-w-xl mx-auto py-8">
            <EmptyStateCard
              variant={search || budgetFilter || styleFilter ? "search" : "trips"}
              actionLabel={search || budgetFilter || styleFilter ? undefined : "✨ Plan AI Trip Now"}
              actionHref="/planner/ai-generator"
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {itineraries.map((itinerary) => (
                <Component
                  key={itinerary._id}
                  travelDetails={{
                    ...itinerary,
                    onDelete: handleDelete,
                  }}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4 px-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Page {pagination.page || 1} of {totalPages} ({pagination.total || 0} trips)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentItinerariesPage;
