"use client";

import React, { useState, useEffect } from "react";
import { useTransition, animated } from "react-spring";
import { fetchTravelData } from "@/lib/fetchTravelData";
import Image from "next/image";
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
        // console.log(`Fetching data for: ${type}, lat: ${lat}, lon: ${lon}`);
        const results = await fetchTravelData(type, lat, lon);
        // console.log("Results from fetchTravelData:", results);
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
            className="fixed top-0 right-0 w-full sm:w-2/3 lg:w-1/3 h-full bg-white-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-30 shadow-lg p-4 overflow-y-scroll z-50"
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
            </div>
            {error && <p className="text-red-500">{error}</p>}

            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="w-10 h-10 " role="status">
                  <div className="flex space-x-2">
                    <div className="h-4 w-4 rounded-full bg-[#166F5B] animate-bounce"></div>
                    <div className="h-4 w-4 rounded-full bg-[#166F5B] animate-bounce2"></div>
                    <div className="h-4 w-4 rounded-full bg-[#166F5B] animate-bounce"></div>
                  </div>
                </div>
              </div>
            ) : data.length === 0 && !error ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <svg
                  className="w-16 h-16 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
                <p className="text-gray-500">
                  No data available. Try changing the type or location.
                </p>
              </div>
            ) : (
              data.map((item, index) =>
                item && item.name && item.address ? (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg shadow-lg bg-white transition-transform transform hover:scale-105 mb-4"
                  >
                    <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                    <p className="text-gray-700">{item.address}</p>
                  </div>
                ) : null
              )
            )}
          </animated.div>
        ) : null
      )}
    </>
  );
};

export default SlideInResults;
