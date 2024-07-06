"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import PlaceCard from "@/components/Card";
import TrendingLocationData from "@/lib/TrendingLocationData.json";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Place {
  id: number;
  placeName: string;
  placeImage: string;
  placeHistory: string;
}

const HomePage: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);

  // use data from TrendingLocationData to set the places state
  useEffect(() => {
    // console.log(TrendingLocationData.loc);
    const places = TrendingLocationData.loc.map((place) => ({
      id: place.id,
      placeName: place.placeName,
      placeImage: place.placeImage,
      placeHistory: place.placeHistory,
    }));
    setPlaces(places);
  }, []);

  return (
    <div className="min-h-screen #F3F7F6] text-black flex flex-col items-center">
      <div className="relative w-full h-60 sm:h-80 bg-cover bg-center bg-bg-dashboard">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl sm:text-4xl bg-yellow-500  font-bold">
            Adventure Starts a Click Away
          </h1>
        </div>
      </div>

      <div className="container mx-auto p-4 flex justify-center flex-col items-center">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Places on the trend
        </h2>
        <ScrollArea className="h-[55vh] w-full">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {places.map((place) => (
              <PlaceCard
                key={place.id}
                title={place.placeName}
                imageUrl={place.placeImage}
                placeHistory={place.placeHistory}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default HomePage;
