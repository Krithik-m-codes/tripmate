"use client";
import dbConnect from "@/lib/dbConnect";
import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import FavoritePlaceCard from "@/components/FavoritePlaceCard";
import AddPlaceForm from "@/components/AddPlaceComponent";
import { motion, AnimatePresence } from "framer-motion";

export default function SavedPlacesPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [savedPlaces, setSavedPlaces] = useState<
    { name: string; location: string; description: string; _id: string }[]
  >([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchSavedPlaces = useCallback(async () => {
    if (!session?.user?._id) return;

    try {
      const response = await fetch(`/api/saved-places/${session.user._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        setSavedPlaces(data.data);
      }
    } catch (error) {
      console.error("Error fetching saved places:", error);
    } finally {
      setLoading(false);
    }
  }, [session?.user?._id]);

  useEffect(() => {
    dbConnect();
    if (status === "authenticated") {
      fetchSavedPlaces();
    }
  }, [status, fetchSavedPlaces]);

  const handlePlaceAdded = () => {
    fetchSavedPlaces();
    setShowAddForm(false);
  };

  if (status === "loading") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center justify-center h-screen"
      >
        <div className="text-3xl font-bold text-primary animate-pulse">
          Loading...
        </div>
      </motion.div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex items-center justify-center h-screen"
      >
        <div className="text-2xl font-semibold text-gray-800 bg-white p-8 rounded-lg shadow-lg">
          Please sign in to view your saved places.
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-gradient-to-br from-teal-100 to-green-100 w-full min-h-screen"
    >
      <motion.h1
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="text-3xl w-full bg-primary font-semibold text-center text-white py-6 shadow-md font-sans "
      >
        Favorites
      </motion.h1>
      <div className="p-4 max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center  text-lg text-gray-800 flex items-center justify-between"
        >
          Here are the places you have saved for later.
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(!showAddForm)}
            className="mb-6 bg-[#166F5B] text-white px-6 py-3 rounded-full shadow-lg transition duration-300 self-end ease-in-out transform hover:bg-[#0D5C4D]"
          >
            {showAddForm ? "Hide Add Form" : "Add New Place"}
          </motion.button>
        </motion.h2>


        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AddPlaceForm onPlaceAdded={handlePlaceAdded} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="p-4 max-w-7xl mx-auto border rounded-lg">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-2xl"
          >
            Loading saved places...
          </motion.div>
        ) : (
          <ScrollArea className="h-[calc(100vh-250px)] w-full px-4">
            <motion.div
              layout
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence>
                {savedPlaces.map((place, index) => (
                  <motion.div
                    key={place._id || index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <FavoritePlaceCard
                      name={place.name}
                      location={place.location}
                      message={place.description}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </ScrollArea>
        )}
      </div>
    </motion.div>
  );
}
