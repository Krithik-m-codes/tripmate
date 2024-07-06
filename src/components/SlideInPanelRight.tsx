"use client";

import React, { useState, useEffect } from "react";
import { useTransition, animated } from "react-spring";
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
  const [type, setType] = useState("restaurants");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`Fetching data for: ${type}, lat: ${lat}, lon: ${lon}`);
        const results = await fetchTravelData(type, lat, lon);
        // console.log("Results from fetchTravelData:", results);
        setData(results);
        setPlaces(results);
        setError(null);
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

  // console.log("Data in SlideInResults:", data);
  // console.log("Lat:", lat, "Lon:", lon, "Visible:", visible);

  const transition = useTransition(visible, {
    from: { transform: "translateX(100%)" },
    enter: { transform: "translateX(0%)" },
    leave: { transform: "translateX(100%)" },
  });

  return (
    <>
      {transition((style, item) =>
        item ? (
          <animated.div
            style={style}
            className="fixed top-0 right-0 w-full sm:w-2/3 lg:w-1/3 h-full bg-white shadow-lg p-4 overflow-y-scroll z-50"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Places</h2>
              <button
                onClick={() => setVisible(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
            </div>
            <div className="flex justify-around mb-4">
              <button
                onClick={() => setType("restaurants")}
                className={`px-4 py-2 rounded ${
                  type === "restaurants"
                    ? "bg-[#166F5B] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Restaurants
              </button>
              <button
                onClick={() => setType("attractions")}
                className={`px-4 py-2 rounded ${
                  type === "attractions"
                    ? "bg-[#166F5B] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Attractions
              </button>
              <button
                onClick={() => setType("hotels")}
                className={`px-4 py-2 rounded ${
                  type === "hotels"
                    ? "bg-[#166F5B] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Hotels
              </button>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {data.length === 0 && !error && (
              <p>No data available. Try changing the type or location.</p>
            )}
            {data.map((item, index) => (
              <div key={index} className="p-2 border-b border-gray-200">
                <h3 className="font-bold">{item.name}</h3>
                <p>{item.address}</p>
              </div>
            ))}
          </animated.div>
        ) : null
      )}
    </>
  );
};

export default SlideInResults;
