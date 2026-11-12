"use client";
import { useSession } from "@/lib/authClient";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import FavoritePlaceCard from "@/components/FavoritePlaceCard";
import AddPlaceForm from "@/components/AddPlaceComponent";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Plus, Loader2, MapPin, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useGetSavedPlacesQuery, useDeleteSavedPlaceMutation } from "@/store/api/placesApi";
import { toast } from "react-toastify";

export default function SavedPlacesPage() {
  const { data: session, status } = useSession();
  const [showAddForm, setShowAddForm] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const { data, isLoading, isFetching, refetch } = useGetSavedPlacesQuery({
    page,
    limit: 6,
    search: search.trim() || undefined,
    category: categoryFilter || undefined,
  });

  const [deletePlace] = useDeleteSavedPlaceMutation();

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this place from your saved collection?")) return;
    try {
      await deletePlace(id).unwrap();
      toast.success("Place removed");
    } catch (e: any) {
      toast.error("Failed to delete place");
    }
  };

  const savedPlaces = data?.data || [];
  const pagination = data?.pagination as any || { page: 1, totalPages: 1, total: 0 };
  const totalPages = pagination.totalPages || pagination.pages || 1;

  const handlePlaceAdded = () => {
    refetch();
    setShowAddForm(false);
  };

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600 dark:text-emerald-400" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-slate-950">
        <div className="rounded-2xl bg-white dark:bg-slate-900 p-8 text-center shadow-lg border border-slate-200 dark:border-slate-800">
          <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">
            Please sign in to view your saved places.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-emerald-50/40 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* Page header & Filters */}
      <div className="border-b border-emerald-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-6 py-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center">
              <Heart className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Saved Places</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {pagination.total || 0} {(pagination.total || 0) === 1 ? "place" : "places"} saved across your bucket lists
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search place or location..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:opacity-95 rounded-xl shadow-md px-4 py-2 text-sm font-semibold shrink-0"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              {showAddForm ? "Cancel" : "Add place"}
            </Button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-3 flex-wrap text-xs font-medium">
          <span className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
            <Filter className="w-3.5 h-3.5" /> Filter Category:
          </span>
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Categories</option>
            <option value="Must Visit">Must Visit</option>
            <option value="Restaurant">Restaurant</option>
            <option value="Hotel / Stay">Hotel / Stay</option>
            <option value="Activity">Activity</option>
            <option value="Scenic Spot">Scenic Spot</option>
          </select>

          {(search || categoryFilter) && (
            <button
              onClick={() => { setSearch(""); setCategoryFilter(""); setPage(1); }}
              className="text-emerald-600 dark:text-emerald-400 hover:underline ml-1"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-b border-emerald-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4"
          >
            <AddPlaceForm onPlaceAdded={handlePlaceAdded} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <ScrollArea className="flex-1 px-6 py-6">
        {isLoading || isFetching ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600 dark:text-emerald-400" />
          </div>
        ) : savedPlaces.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-3 py-20 text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/80">
              <MapPin className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-base font-semibold text-slate-800 dark:text-slate-100">No saved places found</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
              {search || categoryFilter
                ? "Try adjusting your search or category filter."
                : "Add your favourite spots, landmarks, and hidden gems so they appear here."}
            </p>
            <Button
              onClick={() => setShowAddForm(true)}
              className="mt-2 gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:opacity-95 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-md"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              Add a place now
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {savedPlaces.map((place, index) => (
                  <motion.div
                    key={place._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <FavoritePlaceCard
                      _id={place._id}
                      name={place.name}
                      location={place.location}
                      message={place.description}
                      category={(place as any).category || "Must Visit"}
                      onDelete={handleDelete}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4 px-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Page {pagination.page || 1} of {totalPages} ({pagination.total || 0} places)
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
      </ScrollArea>
    </div>
  );
}
