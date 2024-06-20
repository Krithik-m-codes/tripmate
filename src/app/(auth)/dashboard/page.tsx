// pages/dashboard.tsx
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import Sidebar from "@/components/Sidebar";

interface SearchHistoryItem {
  term: string;
}

interface PlaceRecommendation {
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  location: string;
}

function DashboardPage() {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [placeRecommendations, setPlaceRecommendations] = useState<
    PlaceRecommendation[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSearchHistory = async () => {
    try {
      const response = await fetch("/api/search-history");
      const data = await response.json();
      setSearchHistory(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPlaceRecommendations = async (term: string) => {
    try {
      const response = await fetch(
        `https://external-api.com/places?q=${term}`
      );
      const responseData = await response.json();
      setPlaceRecommendations(responseData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchTermChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (!searchTerm) return;

    // Update search history
    setSearchHistory([...searchHistory, { term: searchTerm }]);

    // Fetch place recommendations
    await fetchPlaceRecommendations(searchTerm);
  };

  useEffect(() => {
    fetchSearchHistory();
  }, []);

  return (
    <div className="dashboard flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="flex flex-row justify-between items-center px-4 py-2 bg-white shadow-md">
        <div className="text-xl font-bold">Travel Buddy Experiences</div>
        <div className="flex items-center space-x-4">
          <button className="px-3 py-2 text-gray-600 hover:text-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
            Notifications
          </button>
          <Image
            src="/user-avatar.svg"
            alt="User avatar"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full"
          />
          <button className="px-3 py-2 text-gray-600 hover:text-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
            Profile
          </button>
          <button
            className="px-3 py-2 text-gray-600 hover:text-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            onClick={() => signOut()}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex flex-col flex-grow px-4 py-4">
        {/* Search bar */}
        <form onSubmit={handleSearchSubmit} className="flex items-center">
          <input
            type="text"
            placeholder="Search for local experiences"
            value={searchTerm}
            onChange={handleSearchTermChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
          >
            Search
          </button>
        </form>

        {/* Search history */}
        {searchHistory.length > 0 && (
          <div className="search-history bg-gray-100 rounded-md p-4 mt-4 shadow-md">
            <h3>Search History</h3>
            <ul className="list-none">
              {searchHistory.map((item) => (
                <li key={item.term} className="py-2 border-b border-gray-300">
                  {item.term}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Place recommendations */}
        {placeRecommendations.length > 0 && (
          <div className="place-recommendations mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {placeRecommendations.map((place) => (
              <div
                key={place.title}
                className="p-4 bg-white rounded-md shadow-md"
              >
                <h3 className="text-xl font-bold">{place.title}</h3>
                <p className="text-gray-600">{place.description}</p>
                <p className="text-gray-600">{place.location}</p>
                <p className="text-gray-600">{place.price}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="flex flex-row justify-between items-center px-4 py-2 bg-white shadow-md">
        <div className="text-gray-600">
          © 2023 Travel Buddy Experiences. All rights reserved.
        </div>
        <div className="flex items-center space-x-4">
          <button className="px-3 py-2 text-gray-600 hover:text-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
            Help
          </button>
          <button className="px-3 py-2 text-gray-600 hover:text-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
            About
          </button>
        </div>
      </footer>
    </div>
  );
}

export default DashboardPage;
