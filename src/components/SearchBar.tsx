"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search as SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface SearchProps {
  handleLocationSelect: (lat: number, lon: number, searchQuery: string) => void;
}

const Search: React.FC<SearchProps> = ({ handleLocationSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchQuery
        )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
        }&limit=5`
      );
      const data = await response.json();
      setSuggestions(data.features);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  const handleSuggestionClick = useCallback(
    (suggestion: any) => {
      const [longitude, latitude] = suggestion.center;
      handleLocationSelect(latitude, longitude, suggestion.place_name);
      setSearchQuery(suggestion.place_name);
      setShowSuggestions(false);
      router.push(`?lat=${latitude}&lon=${longitude}`);
    },
    [handleLocationSelect, router]
  );

  return (
    <div ref={searchContainerRef} className="absolute top-4 md:top-14 left-16 z-10 w-80">
      <motion.div
        className="p-4 bg-white bg-opacity-90 shadow-lg rounded-lg border border-gray-200"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {/* Label and Search Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="searchInput" className="text-sm font-medium text-gray-700">
            Search for Places, Restaurants, or Attractions
          </label>

          <div className="relative">
            <input
              id="searchInput"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Type here..."
              className="w-full px-4 py-2 rounded-md border border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-700"
            />

            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-teal-500 hover:text-teal-700"
            >
              <SearchIcon size={20} />
            </button>
          </div>

          <small className="text-xs text-gray-500">
            Enter keywords for places, restaurants, or attractions.
          </small>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div
            className="mt-2 text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            Loading...
          </motion.div>
        )}
      </motion.div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <motion.ul
          className="mt-2 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {suggestion.place_name}
            </li>
          ))}
        </motion.ul>
      )}
    </div>
  );
};

export default Search;
