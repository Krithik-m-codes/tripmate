"use client";
import dbConnect from "@/lib/dbConnect";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

import FavoritePlaceCard from "@/components/FavoritePlaceCard";

export default function SavedPlacesPage() {
  const { data: session } = useSession();
  //   console.log("Session : ", session?.user);
  const [Loading, setLoading] = useState(true);
  const [savedPlaces, setSavedPlaces] = useState([
    {
      name: "",
      location: "",
      description: "",
    },
  ]);

  // Fetch saved places from database
  useEffect(() => {
    dbConnect();
    const fetchSavedPlaces = async () => {
      const response = await fetch(`/api/saved-places/${session?.user._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      // console.log(data);
      if (data.success) {
        setSavedPlaces(data.data);
        setLoading(false);
      }
    };
    fetchSavedPlaces();
  }, [session?.user._id, setSavedPlaces]);

  return (
    <div className="bg-[#F3F7F6] w-full min-h-screen">
      <h1 className="text-2xl w-full bg-[#166F5B] text-center text-white py-4 ">
        Saved Places
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 p-4 place-items-center overflow-y-auto ">
        {Loading ? (
          <div className="text-center text-2xl">Loading...</div>
        ) : (
          <ScrollArea className="h-screen w-full flex flex-col items-center">
            {savedPlaces.map((place, index) => (
              <FavoritePlaceCard
                key={index}
                name={place.name}
                location={place.location}
                message={place.description}
              />
            ))}
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
