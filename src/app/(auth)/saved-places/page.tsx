"use client";
import dbConnect from "@/lib/dbConnect";
import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import FavoritePlaceCard from "@/components/FavoritePlaceCard";
import AddPlaceForm from "@/components/AddPlaceComponent";

export default function SavedPlacesPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [savedPlaces, setSavedPlaces] = useState([
    {
      name: "",
      location: "",
      description: "",
    },
  ]);
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
    return <div className="text-center text-2xl">Loading...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="text-center text-2xl">
        Please sign in to view your saved places.
      </div>
    );
  }

  return (
    <div className="bg-[#F3F7F6] w-full min-h-screen">
      <h1 className="text-2xl w-full bg-[#166F5B] text-center text-white py-4">
        Saved Places
      </h1>
      <div className="p-4">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="mb-4 bg-[#166F5B] text-white px-4 py-2 rounded"
        >
          {showAddForm ? "Hide Add Form" : "Add New Place"}
        </button>
        {showAddForm && <AddPlaceForm onPlaceAdded={handlePlaceAdded} />}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 p-4">
        {loading ? (
          <div className="text-center text-2xl">Loading saved places...</div>
        ) : (
          <ScrollArea className="h-[85vh] w-full">
            <div className="h-auto w-full flex flex-col items-center">
              {savedPlaces.map((place, index) => (
                <FavoritePlaceCard
                  key={index}
                  name={place.name}
                  location={place.location}
                  message={place.description}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
