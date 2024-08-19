"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import RecentHistoryCard from "@/components/RecentHistoryCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import dbConnect from "@/lib/dbConnect";

function RecentHistory() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [recentHistory, setRecentHistory] = useState<
    {
      search: string;
      createdAt: string;
    }[]
  >([]);

  useEffect(() => {
    dbConnect();
    const fetchRecentHistory = async () => {
      try {
        const response = await fetch(
          `/api/search-history/${session?.user._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          setRecentHistory(data.data);
        } else {
          console.error("Failed to fetch recent history");
        }
      } catch (error) {
        console.error("Error fetching recent history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user._id) {
      fetchRecentHistory();
    }
  }, [session?.user._id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 to-green-100 ">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold text-white text-center py-6 px-4 bg-[#166F5B] shadow-lg font-sans"
      >
        Recent History
      </motion.h1>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-50 rounded-lg shadow-xl p-6"
        >
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : recentHistory.length > 0 ? (
            <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
              <div className="space-y-4">
                {recentHistory.map((history, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <RecentHistoryCard
                      key={index}
                      destination={history.search}
                      date={new Date(history.createdAt).toLocaleDateString()}
                    />
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-center text-gray-500 py-8">
              No recent history found.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default RecentHistory;
