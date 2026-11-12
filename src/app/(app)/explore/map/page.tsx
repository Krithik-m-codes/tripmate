"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/authClient";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Search from "@/components/SearchBar";
import SlideInResults from "@/components/SlideInPanelRight";
import { MapStyleSwitcher } from "@/components/map/MapStyleSwitcher";
import { getStylesForPlan, getDefaultStyleUrl } from "@/lib/mapConfig";
import api from "@/lib/api";
import type { MapHandle } from "@/types/map";

// Load map implementations lazily — avoids SSR crashes and only bundles what's needed
const MapboxMap = dynamic(
  () => import("@/components/map/MapboxMap").then((m) => m.MapboxMap),
  { ssr: false, loading: () => <div className="h-full w-full animate-pulse bg-slate-200" /> }
);
const MapLibreMap = dynamic(
  () => import("@/components/map/MapLibreMap").then((m) => m.MapLibreMap),
  { ssr: false, loading: () => <div className="h-full w-full animate-pulse bg-slate-200" /> }
);

interface MapPlace {
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

export default function MapPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const plan = (session?.user?.plan ?? "free") as "free" | "pro";
  const isPro = plan === "pro";

  const styles = getStylesForPlan(plan);
  const [mapStyle, setMapStyle] = useState(() => getDefaultStyleUrl(plan));
  const [styleMenuOpen, setStyleMenuOpen] = useState(false);

  const [mapRef, setMapRef] = useState<MapHandle | null>(null);
  const [userLocation, setUserLocation] = useState({ lat: 12.971599, lng: 77.594566 });
  const [destination, setDestination] = useState<{ lat: number; lon: number } | null>(null);
  const [panelVisible, setPanelVisible] = useState(false);
  const [places, setPlaces] = useState<MapPlace[]>([]);

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {}
    );
  }, []);

  // When plan changes (e.g. after upgrade), reset to that plan's default style
  useEffect(() => {
    setMapStyle(getDefaultStyleUrl(plan));
  }, [plan]);

  const handleLocationSelect = useCallback(
    async (lat: number, lon: number, searchQuery: string) => {
      mapRef?.flyTo({ center: [lon, lat], zoom: 13, duration: 1500 });
      setDestination({ lat, lon });
      setPanelVisible(true);

      if (session?.user?._id) {
        try {
          await api.post("/users/search-history/add", {
            userId: session.user._id,
            search: searchQuery,
          });
        } catch {
          // Non-critical — don't surface to user
        }
      }
    },
    [mapRef, session]
  );

  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-emerald-900 to-slate-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-white/10 bg-white/10 p-10 text-center text-white backdrop-blur-xl"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
            <MapPin className="h-8 w-8 text-emerald-300" />
          </div>
          <h2 className="mb-2 text-2xl font-bold">Explore the world</h2>
          <p className="mb-6 text-emerald-100/80">
            Sign in to unlock the interactive map, search places, and save your favourites.
          </p>
          <Button
            className="gap-2 bg-emerald-500 text-white hover:bg-emerald-600"
            onClick={() => router.push("/sign-in")}
          >
            <LogIn className="h-4 w-4" />
            Sign in to continue
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="relative h-screen w-full overflow-hidden">
      {/* Plan-aware map */}
      {isPro ? (
        <MapboxMap
          mapStyle={mapStyle}
          initialLat={userLocation.lat}
          initialLng={userLocation.lng}
          places={places}
          mapboxToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? ""}
          onMapLoad={(m) => setMapRef(m)}
        />
      ) : (
        <MapLibreMap
          mapStyle={mapStyle}
          initialLat={userLocation.lat}
          initialLng={userLocation.lng}
          places={places}
          onMapLoad={(m) => setMapRef(m)}
        />
      )}

      {/* Floating search bar */}
      <div className="pointer-events-none absolute inset-x-4 top-4 z-20 md:inset-x-auto md:left-4 md:w-96">
        <div className="pointer-events-auto">
          <Search handleLocationSelect={handleLocationSelect} />
        </div>
      </div>

      {/* Map style switcher */}
      <MapStyleSwitcher
        styles={styles}
        currentStyleUrl={mapStyle}
        open={styleMenuOpen}
        onToggle={() => setStyleMenuOpen((v) => !v)}
        onSelect={(s) => {
          setMapStyle(s.url);
          setStyleMenuOpen(false);
        }}
        plan={plan}
      />

      {/* Slide-in results panel */}
      {destination && (
        <SlideInResults
          lat={destination.lat}
          lon={destination.lon}
          visible={panelVisible}
          setVisible={setPanelVisible}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setPlaces={setPlaces as (p: any[]) => void}
        />
      )}
    </main>
  );
}
