"use client";
import dbConnect from "@/lib/dbConnect";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function SavedPlacesPage() {
  const { data: session } = useSession();
  //   console.log("Session : ", session?.user);
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
      console.log(data);
      if (data.success) {
        setSavedPlaces(data.data);
      }
    };
    fetchSavedPlaces();
  }, [session?.user._id, setSavedPlaces]);

  return (
    <div>
      <h1 
      className="text-2xl w-full bg-slate-800 text-center text-white py-4 "
       >Saved Places</h1>
      <ul className="list flex justify-center items-start gap-10 flex-col ">
        {session?.user ? (
          <p className="text-4xl font-bold mb-4">Hello {session?.user.name}</p>
        ) : (
          <p className="text-4xl font-bold mb-4">Loading Places ..</p>
        )}
        {/* Display saved places here */}
        {savedPlaces.map((place) => (
          <li key={place.name}>
            <p>{place.name}</p>
            <p>{place.location}</p>
            <p>{place.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
