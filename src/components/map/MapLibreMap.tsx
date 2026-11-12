"use client";
import { useState } from "react";
import Map, {
  NavigationControl,
  GeolocateControl,
  Marker,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { motion } from "framer-motion";
import Image from "next/image";
import type { MapLibreMapType } from "@/types/map";

interface Place {
  location_id: string;
  name: string;
  latitude: string;
  longitude: string;
  address_obj?: { street1: string; city: string; state: string; country: string };
  phone?: string;
  num_reviews?: string;
  web_url?: string;
}

interface Props {
  mapStyle: string;
  initialLat: number;
  initialLng: number;
  places: Place[];
  onMapLoad: (map: MapLibreMapType) => void;
}

function PlaceMarker({ place }: { place: Place }) {
  const [hovered, setHovered] = useState(false);
  const lat = parseFloat(place.latitude);
  const lng = parseFloat(place.longitude);
  if (isNaN(lat) || isNaN(lng)) return null;

  return (
    <Marker latitude={lat} longitude={lng}>
      <button
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setTimeout(() => setHovered(false), 1000)}
      >
        <Image src="/assets/map-pin.svg" alt="Marker" width={36} height={36} />
      </button>
      {hovered && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-10 w-56 rounded-xl bg-white p-3 shadow-xl"
          style={{ top: -110, left: -70 }}
        >
          <p className="font-semibold text-slate-900">{place.name}</p>
          {place.address_obj && (
            <p className="mt-0.5 text-xs text-slate-500">
              {place.address_obj.city}, {place.address_obj.country}
            </p>
          )}
        </motion.div>
      )}
    </Marker>
  );
}

export function MapLibreMap({
  mapStyle,
  initialLat,
  initialLng,
  places,
  onMapLoad,
}: Props) {
  return (
    <Map
      mapStyle={mapStyle}
      style={{ width: "100%", height: "100%" }}
      initialViewState={{ latitude: initialLat, longitude: initialLng, zoom: 11 }}
      onLoad={({ target }) => onMapLoad(target as unknown as MapLibreMapType)}
      maxZoom={20}
      minZoom={3}
    >
      <NavigationControl position="top-right" />
      <GeolocateControl position="top-right" trackUserLocation />
      {places.map((p, i) => (
        <PlaceMarker key={p.location_id || i} place={p} />
      ))}
    </Map>
  );
}
