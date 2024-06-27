// page.js
"use client";
import { useState, useRef } from "react";
import Map, {
  NavigationControl,
  GeolocateControl,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function Home() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState({
    lat: 0,
    long: 0,
  });

  // get user location
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

  return (
    <main className="w-full h-screen">
      <Map
        ref={mapRef}
        mapboxAccessToken={mapboxToken}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ width: "100%", height: "100%" }}
        initialViewState={{
          latitude: userLocation.lat || 12.9716,
          longitude: userLocation.long || 45,
          zoom: 10,
        }}
        maxZoom={20}
        minZoom={3}
      >
        <GeolocateControl position="top-right" trackUserLocation />
        <NavigationControl position="top-right" />
      </Map>
    </main>
  );
}
