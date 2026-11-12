"use client";
import { useState, useEffect } from "react";
import {
  TrendingUp,
  Compass,
  Calendar,
  Bot,
  Heart,
  UtensilsCrossed,
  Map,
  SignpostBig,
  History,
  Archive,
  User,
  RefreshCw,
  CloudSun,
  MapPin,
  Wind,
  Thermometer,
  ChevronRight,
  Plus,
  Wallet,
  CheckSquare,
  Sparkles,
  ArrowRight,
  Cpu,
  Brain,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import loc from "@/lib/TrendingLocationData.json";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/authClient";
import OrganizationManager from "@/components/OrganizationManager";
import { useGetItinerariesQuery } from "@/store/api/itineraryApi";
import { useGetSavedPlacesQuery } from "@/store/api/placesApi";
import EmptyStateCard from "@/components/ui/EmptyStateCard";
import Link from "next/link";
import { motion } from "framer-motion";

interface WeatherData {
  success: boolean;
  data: {
    main: { temp: number; feels_like: number };
    weather: { description: string; icon: string }[];
    name: string;
    wind: { speed: number };
    sys: { country: string };
  };
}

const WeatherCard = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchWeather = () => {
    setLoading(true);
    setError(false);
    if (!navigator.geolocation) {
      setError(true);
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `/api/weather-report?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`
          );
          const data = await res.json();
          setWeather(data);
        } catch {
          setError(true);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError(true);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  return (
    <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 shadow-md transition-all hover:shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <CloudSun className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Current Weather & Climate
          </h3>
        </div>
        <button
          onClick={fetchWeather}
          className="h-8 w-8 rounded-full p-0 flex items-center justify-center text-slate-500 hover:bg-emerald-100 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
          aria-label="Refresh weather"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-4 py-3">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
        </div>
      ) : error || !weather || !weather.success ? (
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
            <MapPin className="h-6 w-6 text-emerald-500" />
            <div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Enable Location Services</p>
              <p className="text-[11px] text-slate-400">Allow location access to get real-time weather alerts.</p>
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={fetchWeather} className="text-xs rounded-xl h-8">
            Try Again
          </Button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-black text-2xl shadow-sm">
              {Math.round(weather.data.main.temp)}°
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{weather.data.name}, {weather.data.sys.country}</span>
              </h4>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 capitalize">
                {weather.data.weather[0]?.description || "Clear sky"} • Feels like {Math.round(weather.data.main.feels_like)}°C
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 px-4 py-2.5 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="flex items-center gap-1.5">
              <Wind className="h-4 w-4 text-emerald-500" /> {weather.data.wind.speed} m/s wind
            </span>
            <span className="flex items-center gap-1.5 border-l border-slate-200 dark:border-slate-700 pl-4">
              <Thermometer className="h-4 w-4 text-amber-500" /> Comfortable
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const TrendingPlaces = () => (
  <ScrollArea className="h-[340px] pr-2">
    <div className="space-y-3">
      {loc.loc.map((location, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.01, x: 4 }}
          className="flex items-center gap-3 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/60 p-2.5 transition-colors hover:bg-emerald-50/80 dark:hover:bg-slate-800 shadow-xs cursor-pointer"
        >
          <Image
            src={location.placeImage}
            alt={location.placeName}
            width={64}
            height={64}
            className="h-14 w-14 shrink-0 rounded-xl object-cover shadow-sm"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate font-bold text-slate-800 dark:text-slate-100 text-sm">{location.placeName}</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
              <Sparkles className="h-3 w-3" /> Trending #{index + 1}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600" />
        </motion.div>
      ))}
    </div>
  </ScrollArea>
);

const QuickActions = () => {
  const router = useRouter();
  const actions = [
    { icon: Sparkles, label: "Plan New Trip", path: "/planner/ai-generator", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800" },
    { icon: Map, label: "Explore Map", path: "/explore/map", color: "text-teal-600 bg-teal-50 dark:bg-teal-950/80 border-teal-200 dark:border-teal-800" },
    { icon: Archive, label: "Saved Itineraries", path: "/planner/recent", color: "text-purple-600 bg-purple-50 dark:bg-purple-950/80 border-purple-200 dark:border-purple-800" },
    { icon: Heart, label: "Saved Places", path: "/explore/saved", color: "text-rose-600 bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800" },
    { icon: Wallet, label: "Budget Tracker", path: "/planner/budget", color: "text-amber-600 bg-amber-50 dark:bg-amber-950/80 border-amber-200 dark:border-amber-800" },
    { icon: CheckSquare, label: "Packing Checklists", path: "/planner/checklist", color: "text-blue-600 bg-blue-50 dark:bg-blue-950/80 border-blue-200 dark:border-blue-800" },
    { icon: Brain, label: "Travel Notes & Tips", path: "/planner/brain", color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/80 border-indigo-200 dark:border-indigo-800" },
    { icon: User, label: "Profile Settings", path: "/settings/profile", color: "text-slate-600 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action, i) => (
        <motion.button
          key={i}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => router.push(action.path)}
          className={`flex items-center gap-3 rounded-2xl border bg-white dark:bg-slate-900 px-3.5 py-3.5 text-left text-xs font-semibold text-slate-800 dark:text-slate-100 shadow-xs transition-all hover:shadow-sm ${action.color.split(" ").slice(2).join(" ")}`}
        >
          <div className={`p-2 rounded-xl ${action.color.split(" ").slice(0, 2).join(" ")} shrink-0`}>
            <action.icon className="h-4 w-4" />
          </div>
          <span className="truncate">{action.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

const LiveItineraryPreview = ({ organizationId }: { organizationId?: string }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?._id;

  const { data: itinerariesData, isLoading, error } = useGetItinerariesQuery({
    userId,
    organizationId,
    page: 1,
    limit: 5,
  });

  const list = itinerariesData?.data || [];

  if (isLoading) {
    return (
      <div className="space-y-3 p-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (error || list.length === 0) {
    return (
      <EmptyStateCard
        variant="trips"
        title="No Workspace Trips Yet"
        description="Generate your first AI itinerary right now to begin organizing your adventure."
        actionLabel="✨ Plan AI Trip"
        actionHref="/planner/ai-generator"
        className="!p-6 !rounded-2xl"
      />
    );
  }

  return (
    <ScrollArea className="h-[340px] pr-2">
      <div className="space-y-3">
        {list.map((item: any) => (
          <motion.div
            key={item._id}
            whileHover={{ scale: 1.01, x: 4 }}
            onClick={() => router.push(`/planner/recent`)}
            className="group flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:bg-emerald-50/80 dark:hover:bg-slate-800 cursor-pointer transition-all shadow-xs"
          >
            <div className="min-w-0 flex-1">
              <p className="font-bold text-slate-900 dark:text-white text-sm truncate group-hover:text-emerald-600 transition-colors">
                {item.destination}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] capitalize">
                  {item.travelStyle || "Exploration"}
                </span>
                <span>• {item.budget || "Moderate"} budget</span>
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default function Dashboard() {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(" ")[0] ?? "Traveler";
  const [selectedOrgId, setSelectedOrgId] = useState<string | undefined>(undefined);

  const { data: places } = useGetSavedPlacesQuery({});
  const { data: itineraries } = useGetItinerariesQuery({});
  const placesCount = places?.data?.length || 0;
  const itinerariesCount = itineraries?.data?.length || 0;

  return (
    <ScrollArea className="h-screen bg-gradient-to-br from-emerald-50/40 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-7xl space-y-8 p-4 md:p-6 lg:p-8 pb-28">
        {/* Top Header & Workspace Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              <Compass className="h-3.5 w-3.5" /> Your Travel Hub
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Welcome back, {firstName}.
            </h1>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <OrganizationManager currentOrgId={selectedOrgId} onSelectOrg={setSelectedOrgId} />
            <Link href="/planner/ai-generator">
              <Button className="rounded-2xl bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 px-5 py-5 text-xs font-semibold text-white shadow-sm transition-all gap-2">
                <Sparkles className="h-4 w-4" />
                <span>Plan New Trip</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md bg-slate-900">
          <Image
            src="/assets/dashboard-bg.jpg"
            alt="Travel inspiration"
            width={1200}
            height={400}
            className="h-56 w-full object-cover md:h-64 opacity-70 mix-blend-overlay"
            priority
          />
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent p-6 md:p-8">
            <div className="max-w-2xl space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white">
                <Compass className="h-3 w-3" /> Curated Travel Companion
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Where will your curiosity take you next?
              </h2>
              <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                Let our intelligent assistant build a bespoke, day-by-day itinerary tailored to your pace, budget, and culinary tastes.
              </p>
            </div>
          </div>
        </div>

        {/* KPI Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold">
                <Archive className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Saved Itineraries</p>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white">{itinerariesCount}</h4>
              </div>
            </div>
          </Card>

          <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-bold">
                <Heart className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Saved Places</p>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white">{placesCount}</h4>
              </div>
            </div>
          </Card>

          <Link href="/planner/budget">
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group h-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 font-bold">
                    <Wallet className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Smart Budget</p>
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">Track Expenses</h4>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          <Link href="/planner/checklist">
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group h-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold">
                    <CheckSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Packing List</p>
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">Checklist Hub</h4>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>
        </div>

        {/* Weather Card */}
        <WeatherCard />

        {/* Main 3-Column Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-sm overflow-hidden flex flex-col justify-between">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                  Trending Destinations
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <TrendingPlaces />
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-sm overflow-hidden flex flex-col justify-between">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400">
                  <Compass className="h-5 w-5" />
                </div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                  Quick Actions Hub
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <QuickActions />
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-sm overflow-hidden flex flex-col justify-between md:col-span-2 lg:col-span-1">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400">
                  <Calendar className="h-5 w-5" />
                </div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                  Recent Trips
                </CardTitle>
              </div>
              <Link href="/planner/recent" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                View all →
              </Link>
            </CardHeader>
            <CardContent className="p-4">
              <LiveItineraryPreview organizationId={selectedOrgId} />
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
}
