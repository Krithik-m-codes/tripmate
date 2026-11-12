"use client";
import { useSession } from "@/lib/authClient";
import { useEffect, useState } from "react";
import RecentHistoryCard from "@/components/RecentHistoryCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { History, Loader2, Search } from "lucide-react";

function RecentHistory() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [recentHistory, setRecentHistory] = useState<
    { search: string; createdAt: string }[]
  >([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`/api/users/search-history/${session?.user._id}`, {
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (data.success) {
          setRecentHistory(data.data);
        } else {
          console.error("Failed to fetch search history");
        }
      } catch (error) {
        console.error("Error fetching search history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user._id) fetchHistory();
  }, [session?.user._id]);

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-emerald-50 via-white to-slate-50">
      {/* Page header */}
      <div className="flex items-center gap-2 border-b border-emerald-100 bg-white px-6 py-5 shadow-sm">
        <History className="h-5 w-5 text-emerald-600" />
        <div>
          <h1 className="text-xl font-bold text-slate-900">Recent History</h1>
          <p className="text-xs text-slate-500">Your recent search activity</p>
        </div>
      </div>

      <ScrollArea className="flex-1 px-6 py-6">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : recentHistory.length > 0 ? (
          <div className="space-y-3">
            <AnimatePresence>
              {recentHistory.map((history, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                >
                  <RecentHistoryCard
                    destination={history.search}
                    date={new Date(history.createdAt).toLocaleDateString()}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-3 py-20 text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <Search className="h-8 w-8 text-emerald-600" />
            </div>
            <p className="text-base font-medium text-slate-700">No history yet</p>
            <p className="text-sm text-slate-500">
              Your searches and map explorations will appear here.
            </p>
          </motion.div>
        )}
      </ScrollArea>
    </div>
  );
}

export default RecentHistory;
