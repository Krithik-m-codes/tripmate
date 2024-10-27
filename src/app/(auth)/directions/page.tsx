"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import debounce from "lodash/debounce";
import Suggestions from "@/components/SuggestionsList";
import { fetchSuggestions } from "@/lib/fetchSuggestions";
import { MapPin } from "lucide-react";

const DirectionsPage: React.FC = () => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [directions, setDirections] = useState<any>(null);
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [fromSuggestions, setFromSuggestions] = useState<any[]>([]);
  const [toSuggestions, setToSuggestions] = useState<any[]>([]);
  const [fromCoords, setFromCoords] = useState<[number, number] | null>(null);
  const [toCoords, setToCoords] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const fromMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const toMarkerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

    let mapInstance: mapboxgl.Map | null = null;

    if (mapContainerRef.current) {
      mapInstance = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [17.9542802, 87.4661302],
        zoom: 3,
      });
      setMap(mapInstance);
    }

    // Store current marker references
    const currentFromMarker = fromMarkerRef.current;
    const currentToMarker = toMarkerRef.current;

    return () => {
      mapInstance?.remove();
      currentFromMarker?.remove();
      currentToMarker?.remove();
    };
  }, []);

  const createMarkerElement = useCallback((color: string) => {
    const el = document.createElement("div");
    el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
    return el;
  }, []);

  const addOrUpdateMarker = useCallback(
    (
      coords: [number, number],
      markerRef: React.MutableRefObject<mapboxgl.Marker | null>,
      color: string
    ) => {
      if (map) {
        if (markerRef.current) {
          markerRef.current.setLngLat(coords);
        } else {
          const marker = new mapboxgl.Marker({
            element: createMarkerElement(color),
          })
            .setLngLat(coords)
            .addTo(map);
          markerRef.current = marker;
        }
      }
    },
    [map, createMarkerElement]
  );

  // Handle input change and fetch suggestions
  const handleInputChange = useCallback(
    (
      query: string,
      setQuery: React.Dispatch<React.SetStateAction<string>>,
      setSuggestions: React.Dispatch<React.SetStateAction<any[]>>
    ) => {
      setQuery(query);
      if (query) {
        debounce(async () => {
          try {
            const data = await fetchSuggestions(query);
            setSuggestions(data);
            if (data.length === 0) {
              setError("No suggestions found. Please try a different query.");
            } else {
              setError(null);
            }
          } catch (error) {
            console.error("Error fetching suggestions:", error);
            setError("Failed to fetch suggestions. Please try again.");
            setSuggestions([]);
          }
        }, 2000)();
      } else {
        setSuggestions([]);
        setError(null);
      }
    },
    []
  );

  // Handle suggestion select
  const handleSuggestionSelect = useCallback(
    (
      suggestion: { display_name: string; lat: string; lon: string },
      setCoords: React.Dispatch<React.SetStateAction<[number, number] | null>>,
      setSuggestions: React.Dispatch<React.SetStateAction<any[]>>,
      setQuery: React.Dispatch<React.SetStateAction<string>>
    ) => {
      const coordinates: [number, number] = [
        parseFloat(suggestion.lon),
        parseFloat(suggestion.lat),
      ];
      setCoords(coordinates);
      setSuggestions([]);
      setQuery(suggestion.display_name);
    },
    []
  );

  // Fetch directions when 'from' and 'to' locations are selected
  const fetchDirections = useCallback(async () => {
    if (!fromCoords || !toCoords) {
      setError("Please select both 'from' and 'to' locations.");
      return;
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${fromCoords[0]},${fromCoords[1]};${toCoords[0]},${toCoords[1]}?geometries=geojson&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
      );
      const data = await response.json();

      if (data.code !== "Ok") {
        throw new Error(data.message || "Failed to fetch directions");
      }

      setDirections(data);
      setError(null);

      addOrUpdateMarker(fromCoords, fromMarkerRef, "#3b82f6");
      addOrUpdateMarker(toCoords, toMarkerRef, "#ef4444");
    } catch (error) {
      console.error("Error fetching directions:", error);
      setError("Failed to fetch directions. Please try again.");
    }
  }, [fromCoords, toCoords, addOrUpdateMarker]);

  // Update map bounds and draw route on map when directions are fetched or map is loaded
  useEffect(() => {
    if (map && directions?.routes?.[0]) {
      const coordinates = directions.routes[0].geometry.coordinates;
      const bounds = coordinates.reduce(
        (bounds: mapboxgl.LngLatBounds, coord: number[]) => {
          return bounds.extend(coord as mapboxgl.LngLatLike);
        },
        new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
      );

      map.fitBounds(bounds, { padding: 50 });

      if (map.getSource("route")) {
        (map.getSource("route") as mapboxgl.GeoJSONSource).setData({
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates,
          },
        });
      } else {
        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates,
            },
          },
        });

        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#3b82f6",
            "line-width": 8,
          },
        });
      }
    }
  }, [map, directions]);

  return (
    <div className="flex h-screen w-full overflow-hidden relative">
      {/* Floating Search Form */}

      <div className="absolute z-50 top-20 left-20 p-4 md:p-8 shadow-lg rounded-lg flex flex-col gap-6 bg-white/60 backdrop-blur-md border border-gray-200 w-full max-w-md">
        <h2 className=" text-xl md:text-2xl font-bold mb-2">Plan Your Route</h2>

        {/* From Input */}
        <div className="relative flex flex-col gap-2">
          <label className="text-sm  font-medium" htmlFor="fromLocation">
            Starting Location
          </label>
          <div className="relative">
            <input
              id="fromLocation"
              className="border-gray-300 p-2 md:p-3 rounded w-full pl-10 md:pl-14 bg-white focus:ring-2 focus:ring-purple-500"
              type="text"
              value={from}
              onChange={(e) =>
                handleInputChange(e.target.value, setFrom, setFromSuggestions)
              }
            />
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" size={20} />
            {fromSuggestions.length > 0 && (
              <Suggestions
                suggestions={fromSuggestions}
                onSelect={(suggestion) =>
                  handleSuggestionSelect(suggestion, setFromCoords, setFromSuggestions, setFrom)
                }
              />
            )}
          </div>
          <small className="text-xs text-gray-900">Select your starting location</small>
        </div>

        {/* To Input */}
        <div className="relative flex flex-col gap-2 mt-4">
          <label className="text-sm  font-medium" htmlFor="toLocation">
            Destination
          </label>
          <div className="relative">
            <input
              id="toLocation"
              className="border-gray-300 p-2 md:p-3 rounded w-full pl-10 md:pl-14 bg-white focus:ring-2 focus:ring-indigo-500"
              type="text"
              value={to}
              onChange={(e) =>
                handleInputChange(e.target.value, setTo, setToSuggestions)
              }
            />
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500" size={20} />
            {toSuggestions.length > 0 && (
              <Suggestions
                suggestions={toSuggestions}
                onSelect={(suggestion) =>
                  handleSuggestionSelect(suggestion, setToCoords, setToSuggestions, setTo)
                }
              />
            )}
          </div>
          <small className="text-xs text-gray-900">Select your destination</small>
        </div>

        {/* Get Directions Button */}
        <button
          className="bg-orange-400  hover:bg-orange-700 transition-all font-semibold py-3 rounded-lg w-full mt-4 text-white"
          onClick={fetchDirections}
        >
          Get Directions
        </button>
      </div>


      {/* Error message */}
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded absolute top-4 right-4 z-10 shadow-lg"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
          <span
            className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
            onClick={() => setError(null)}
          >
            <svg
              className="fill-current h-6 w-6 text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </span>
        </div>
      )}
      {/* Map */}
      <div ref={mapContainerRef} className=" flex-1 h-screen w-full bg-gray-200 rounded-lg "></div>
    </div>
  );
};

export default DirectionsPage;
