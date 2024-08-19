
"use client";
import { useState, useEffect } from "react";
import Map, {
  NavigationControl,
  GeolocateControl,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Search from "@/components/SearchBar";
import SlideInResults from "@/components/SlideInPanelRight";
import MapMarker from "@/components/MarkerComponentCard";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// interface for the place object
interface Place {
  location_id: string;
  name: string;
  latitude: string;
  longitude: string;
  [key: string]: any; // Include any other fields that might be present in the API data
}

interface PlacesMapProps {
  places: Place[];
}

export default function Home() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const [mapRef, setMapRef] = useState<any>(null);
  const [userLocation, setUserLocation] = useState({
    lat: 0,
    long: 0,
  });
  const [destination, setDestination] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [panelVisible, setPanelVisible] = useState<boolean>(false);
  const [places, setPlaces] = useState<any[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Get user location on load
  useEffect(() => {
    if (typeof navigator !== "undefined") {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            long: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  }, []);

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center bg-bg-sign-up bg-center bg-cover justify-center min-h-screen bg-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-[350px] shadow-lg">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold text-center mb-4">
                Not Signed In
              </h2>
              <p className="text-center mb-6 text-gray-600">
                You need to be signed in to access this page
              </p>
              <Button
                className="w-full bg-[#166F5B] text-white hover:bg-[#0d4d3d] transition-colors duration-300"
                onClick={() => router.push("/sign-in")}
              >
                Sign In
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }


  // Handle location select from search
  const handleLocationSelect = async (
    lat: number,
    lon: number,
    searchQuery: string
  ) => {
    if (mapRef) {
      mapRef.flyTo({ center: [lon, lat] });
      setDestination({ lat, lon });
      setPanelVisible(true);

      // Add search to history if user is logged in
      if (session?.user?._id) {
        try {
          const response = await fetch("/api/search-history/add", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: session.user._id,
              search: searchQuery,
            }),
          });
          console.log("Search added to history:", response);
          if (!response.ok) {
            throw new Error("Failed to add search to history");
          }
        } catch (error) {
          console.error("Error adding search to history:", error);
        }
      }
    }
  };

  // Check if coordinates are valid
  const isValidCoordinates = (lat: number, lon: number) => {
    return (
      typeof lat === "number" &&
      !isNaN(lat) &&
      typeof lon === "number" &&
      !isNaN(lon)
    );
  };

  return (
    <main className="w-full h-screen relative">
      <Map
        mapboxAccessToken={mapboxToken}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ width: "100%", height: "100%" }}
        initialViewState={{
          latitude: userLocation.lat || 12.971599,
          longitude: userLocation.long || 77.594566,
          zoom: 10,
        }}
        onLoad={({ target }) => setMapRef(target)}
        maxZoom={20}
        minZoom={3}
      >
        <GeolocateControl position="top-right" trackUserLocation />
        <NavigationControl position="top-right" />

        <Search handleLocationSelect={handleLocationSelect} />

        {places.map((place, index) => {
          const latitude = parseFloat(place.latitude);
          const longitude = parseFloat(place.longitude);
          if (isValidCoordinates(latitude, longitude)) {
            return (
              <MapMarker
                key={index}
                place={place}
                onClick={() => setSelectedPlace(place)}
              />
            );
          } else {
            console.error(
              `Invalid coordinates for place: ${place.name}, lat: ${place.latitude}, lon: ${place.longitude}`
            );
            return null;
          }
        })}

      </Map>

      {destination && (
        <SlideInResults
          lat={destination.lat ?? 0}
          lon={destination.lon ?? 0}
          visible={panelVisible}
          setVisible={setPanelVisible}
          setPlaces={setPlaces}
        />
      )}
    </main>
  );
}
