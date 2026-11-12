"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import debounce from "lodash/debounce";
import Suggestions from "@/components/SuggestionsList";
import { fetchSuggestions } from "@/lib/fetchSuggestions";
import { MapStyleSwitcher } from "@/components/map/MapStyleSwitcher";
import { FREE_STYLES } from "@/lib/mapConfig";
import { MapPin, Navigation, X, Loader2, Crown } from "lucide-react";
import { useSession } from "@/lib/authClient";

interface RouteResult {
  distance: number;
  duration: number;
  coordinates: [number, number][];
}

function formatDistance(m: number) {
  return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`;
}
function formatDuration(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m} min`;
}

export default function DirectionsPage() {
  const { data: session } = useSession();
  const plan = (session?.user?.plan ?? "free") as "free" | "pro";
  const isPro = plan === "pro";

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const fromMarkerRef = useRef<maplibregl.Marker | null>(null);
  const toMarkerRef = useRef<maplibregl.Marker | null>(null);

  const [mapStyle, setMapStyle] = useState(FREE_STYLES[0].url);
  const [styleMenuOpen, setStyleMenuOpen] = useState(false);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromSuggestions, setFromSuggestions] = useState<
    { display_name: string; lat: string; lon: string }[]
  >([]);
  const [toSuggestions, setToSuggestions] = useState<
    { display_name: string; lat: string; lon: string }[]
  >([]);
  const [fromCoords, setFromCoords] = useState<[number, number] | null>(null);
  const [toCoords, setToCoords] = useState<[number, number] | null>(null);
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─── Map init ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: mapStyle,
      center: [77.5946, 12.9716],
      zoom: 3,
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update style without re-creating the map
  useEffect(() => {
    mapRef.current?.setStyle(mapStyle);
  }, [mapStyle]);

  // ─── Markers ────────────────────────────────────────────────────────────────
  const upsertMarker = useCallback(
    (
      coords: [number, number],
      markerRef: React.MutableRefObject<maplibregl.Marker | null>,
      color: string
    ) => {
      if (!mapRef.current) return;
      if (markerRef.current) {
        markerRef.current.setLngLat(coords);
      } else {
        const el = document.createElement("div");
        el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
        markerRef.current = new maplibregl.Marker({ element: el })
          .setLngLat(coords)
          .addTo(mapRef.current);
      }
    },
    []
  );

  // ─── Geocoding (Nominatim) ───────────────────────────────────────────────────
  const handleInput = useCallback(
    (
      query: string,
      setQuery: (v: string) => void,
      setSuggestions: (v: { display_name: string; lat: string; lon: string }[]) => void
    ) => {
      setQuery(query);
      if (!query) {
        setSuggestions([]);
        return;
      }
      debounce(async () => {
        try {
          const data = await fetchSuggestions(query);
          setSuggestions(data);
          setError(data.length === 0 ? "No suggestions found." : null);
        } catch {
          setError("Failed to fetch suggestions.");
          setSuggestions([]);
        }
      }, 600)();
    },
    []
  );

  const selectSuggestion = useCallback(
    (
      s: { display_name: string; lat: string; lon: string },
      setCoords: (c: [number, number]) => void,
      setSuggestions: (v: []) => void,
      setQuery: (v: string) => void
    ) => {
      setCoords([parseFloat(s.lon), parseFloat(s.lat)]);
      setSuggestions([]);
      setQuery(s.display_name);
      setError(null);
    },
    []
  );

  // ─── Routing ─────────────────────────────────────────────────────────────────
  const fetchDirections = useCallback(async () => {
    if (!fromCoords || !toCoords) {
      setError("Select both a start and destination.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      let result: RouteResult;

      if (isPro && process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
        // Pro — Mapbox Directions API (optimised routing)
        const res = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${fromCoords[0]},${fromCoords[1]};${toCoords[0]},${toCoords[1]}?geometries=geojson&overview=full&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
        );
        const data = await res.json();
        if (data.code !== "Ok") throw new Error(data.message ?? "Routing failed");
        const r = data.routes[0];
        result = {
          distance: r.distance,
          duration: r.duration,
          coordinates: r.geometry.coordinates,
        };
      } else {
        // Free — OSRM public demo (community-maintained open routing)
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${fromCoords[0]},${fromCoords[1]};${toCoords[0]},${toCoords[1]}?geometries=geojson&overview=full`
        );
        const data = await res.json();
        if (data.code !== "Ok") throw new Error("Routing failed. Try different locations.");
        const r = data.routes[0];
        result = {
          distance: r.distance,
          duration: r.duration,
          coordinates: r.geometry.coordinates,
        };
      }

      setRoute(result);
      upsertMarker(fromCoords, fromMarkerRef, "#059669");
      upsertMarker(toCoords, toMarkerRef, "#ef4444");

      const map = mapRef.current;
      if (!map) return;

      const drawRoute = () => {
        if (map.getSource("route")) {
          (map.getSource("route") as maplibregl.GeoJSONSource).setData({
            type: "Feature",
            properties: {},
            geometry: { type: "LineString", coordinates: result.coordinates },
          });
        } else {
          map.addSource("route", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: { type: "LineString", coordinates: result.coordinates },
            },
          });
          map.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: { "line-join": "round", "line-cap": "round" },
            paint: { "line-color": "#059669", "line-width": 5, "line-opacity": 0.9 },
          });
        }

        const bounds = result.coordinates.reduce(
          (b, c) => b.extend(c as [number, number]),
          new maplibregl.LngLatBounds(result.coordinates[0], result.coordinates[0])
        );
        map.fitBounds(bounds, { padding: 60 });
      };

      if (map.isStyleLoaded()) {
        drawRoute();
      } else {
        map.once("styledata", drawRoute);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get directions.");
    } finally {
      setLoading(false);
    }
  }, [fromCoords, toCoords, isPro, upsertMarker]);

  return (
    <div className="relative flex h-screen w-full overflow-hidden">
      {/* Map canvas */}
      <div ref={mapContainerRef} className="absolute inset-0 h-full w-full" />

      {/* Style switcher */}
      <MapStyleSwitcher
        styles={FREE_STYLES}
        currentStyleUrl={mapStyle}
        open={styleMenuOpen}
        onToggle={() => setStyleMenuOpen((v) => !v)}
        onSelect={(s) => {
          setMapStyle(s.url);
          setStyleMenuOpen(false);
        }}
        plan={plan}
      />

      {/* Floating panel */}
      <div className="absolute left-4 top-4 z-20 w-full max-w-sm">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-2xl backdrop-blur-sm">
          {/* Header */}
          <div className="flex items-center gap-2.5 border-b border-slate-100 bg-linear-to-r from-emerald-50 to-teal-50 px-5 py-4">
            <Navigation className="h-5 w-5 text-emerald-600" />
            <h2 className="font-semibold text-slate-900">Plan Your Route</h2>
            {isPro && (
              <span className="ml-auto flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                <Crown className="h-3 w-3" /> Pro routing
              </span>
            )}
          </div>

          <div className="space-y-4 p-5">
            {/* From */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                From
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  placeholder="Starting location…"
                  value={from}
                  onChange={(e) => handleInput(e.target.value, setFrom, setFromSuggestions)}
                />
                {fromSuggestions.length > 0 && (
                  <Suggestions
                    suggestions={fromSuggestions}
                    onSelect={(s) =>
                      selectSuggestion(s, setFromCoords, setFromSuggestions as () => void, setFrom)
                    }
                  />
                )}
              </div>
            </div>

            {/* To */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                To
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" />
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  placeholder="Destination…"
                  value={to}
                  onChange={(e) => handleInput(e.target.value, setTo, setToSuggestions)}
                />
                {toSuggestions.length > 0 && (
                  <Suggestions
                    suggestions={toSuggestions}
                    onSelect={(s) =>
                      selectSuggestion(s, setToCoords, setToSuggestions as () => void, setTo)
                    }
                  />
                )}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                <span className="flex-1">{error}</span>
                <button onClick={() => setError(null)}>
                  <X className="h-4 w-4 shrink-0" />
                </button>
              </div>
            )}

            {/* Route summary */}
            {route && (
              <div className="flex gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm">
                <div>
                  <p className="text-xs text-emerald-700">Distance</p>
                  <p className="font-semibold text-emerald-900">{formatDistance(route.distance)}</p>
                </div>
                <div className="mx-1 w-px bg-emerald-200" />
                <div>
                  <p className="text-xs text-emerald-700">Duration</p>
                  <p className="font-semibold text-emerald-900">{formatDuration(route.duration)}</p>
                </div>
                {!isPro && (
                  <div className="ml-auto self-center">
                    <span className="rounded-full bg-white px-2 py-0.5 text-xs text-slate-500">
                      OSM routing
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Get directions button */}
            <button
              onClick={fetchDirections}
              disabled={loading || !fromCoords || !toCoords}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Navigation className="h-4 w-4" />
              )}
              {loading ? "Calculating route…" : "Get Directions"}
            </button>

            {!isPro && (
              <p className="text-center text-xs text-slate-400">
                <a href="/pricing" className="font-medium text-amber-600 hover:underline">
                  Upgrade to Pro
                </a>{" "}
                for Mapbox turn-by-turn routing.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
