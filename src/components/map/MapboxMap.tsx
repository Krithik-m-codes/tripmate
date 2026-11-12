"use client";
import Map, { NavigationControl, GeolocateControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapMarker from "@/components/MarkerComponentCard";
import type { MapboxMapType } from "@/types/map";

interface Place {
  location_id: string;
  name: string;
  latitude: string;
  longitude: string;
  address_obj?: { street1: string; city: string; state: string; country: string };
  phone?: string;
  num_reviews?: string;
  web_url?: string;
  [key: string]: unknown;
}

interface Props {
  mapStyle: string;
  initialLat: number;
  initialLng: number;
  places: Place[];
  mapboxToken: string;
  onMapLoad: (map: MapboxMapType) => void;
}

export function MapboxMap({
  mapStyle,
  initialLat,
  initialLng,
  places,
  mapboxToken,
  onMapLoad,
}: Props) {
  return (
    <Map
      mapboxAccessToken={mapboxToken}
      mapStyle={mapStyle}
      style={{ width: "100%", height: "100%" }}
      initialViewState={{ latitude: initialLat, longitude: initialLng, zoom: 11 }}
      onLoad={({ target }) => onMapLoad(target as unknown as MapboxMapType)}
      maxZoom={20}
      minZoom={3}
    >
      <NavigationControl position="top-right" />
      <GeolocateControl position="top-right" trackUserLocation />
      {places.map((place, i) => {
        const lat = parseFloat(place.latitude);
        const lng = parseFloat(place.longitude);
        if (isNaN(lat) || isNaN(lng)) return null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <MapMarker key={place.location_id || i} place={place as any} onClick={() => {}} />;
      })}
    </Map>
  );
}
