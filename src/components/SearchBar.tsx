"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search as SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";

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
        )}.json?access_token=${
          process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
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
    <div ref={searchContainerRef} className="absolute top-4 left-4 z-10 w-64">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search for a location"
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <SearchIcon size={20} />
        </button>
      </div>
      {isLoading && (
        <div className="mt-2 text-sm text-gray-500">Loading...</div>
      )}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="mt-2 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {suggestion.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;
