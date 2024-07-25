"use client";
import { useState, useEffect } from "react";
import Map, {
  NavigationControl,
  GeolocateControl,
  Marker,
  Popup,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Search from "@/components/SearchBar";
import SlideInResults from "@/components/SlideInPanelRight";
import Image from "next/image";
import { useSession } from "next-auth/react"; 

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
  const { data: session } = useSession(); 

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

  
  useEffect(() => {
    console.log("Places updated:", places);
  }, [places]);

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
              <Marker key={index} latitude={latitude} longitude={longitude}>
                <button onClick={() => setSelectedPlace(place)}>
                  <Image
                    src="/assets/map-pin.svg"
                    alt="Marker"
                    className="text-black w-auto h-auto"
                    width={30}
                    height={30}
                  />
                </button>
              </Marker>
            );
          } else {
            console.error(
              `Invalid coordinates for place: ${place.name}, lat: ${place.latitude}, lon: ${place.longitude}`
            );
            return null; // Or handle invalid coordinates in another way
          }
        })}

        {selectedPlace &&
          isValidCoordinates(
            selectedPlace.latitude,
            selectedPlace.longitude
          ) && (
            <Popup
              latitude={selectedPlace.latitude}
              longitude={selectedPlace.longitude}
              onClose={() => setSelectedPlace(null)}
              closeOnClick={false}
              anchor="top"
            >
              <div className="p-2">
                <h3 className="font-bold">{selectedPlace.name}</h3>
                <p>{selectedPlace.address}</p>
              </div>
            </Popup>
          )}
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
