"use client";
import { useState, useEffect } from "react";
import {
  TrendingUp as Trending,
  Compass,
  Calendar,
  Bot,
  Heart,
  CookingPot,
  Map,
  FerrisWheel,
  SignpostBig,
  History,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import loc from "@/lib/TrendingLocationData.json"
import { ScrollArea } from "@/components/ui/scroll-area";

const DashboardCard = ({
  title,
  icon: Icon,
  content,
}: {
  title: string;
  icon: React.ElementType;
  content: React.ReactNode;
}) => (
  <Card className="h-full">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>{content}</CardContent>
  </Card>
);

const TrendingPlaces = () => (
  <ScrollArea className=" h-[360px]">
    <div className="grid grid-cols-1 gap-4">
      {loc.loc.map((location, index) => (
        <div key={index} className="flex flex-row items-center space-x-4">
          <Image
            src={location.placeImage}
            alt={location.placeImage}
            width={100}
            height={100}
            className="w-16 h-16 object-cover rounded-lg"
          />
          <div>
            <h4 className="font-semibold">{location.placeName}</h4>
            <p className="text-muted-foreground">Trending #{index + 1}</p>
          </div>
        </div>
      ))}
    </div>
  </ScrollArea>
);

const QuickActions = () => (
  <div className="grid grid-cols-2 gap-4">
    {[
      { icon: Bot, label: "AI Trip Planner" },
      { icon: User, label: "Profile" },
      { icon: Map, label: "Map" },
      { icon: SignpostBig, label: "Directions" },
      { icon: Heart, label: "Favorites" },
      { icon: CookingPot, label: "Restaurants" },
      { icon: FerrisWheel, label: "Attractions" },
      { icon: History, label: "History" },
    ].map(({ icon: Icon, label }, index) => (
      <Button key={index} variant="outline" className="h-20 flex-col" disabled={true}>
        <Icon className="h-6 w-6 mb-2" />
        {label}
      </Button>
    ))}
  </div>
);

const UpcomingTrip = () => (
  <>
    <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-lg p-6 text-white shadow-lg transform transition-transform hover:scale-105">
      <h3 className="font-extrabold text-xl mb-3">Your Next Adventure</h3>
      <p className="text-lg mb-2">Santorini, Greece</p>
      <p className="text-sm mb-4">Departure: August 15, 2024</p>
      <Button variant="secondary" className="mt-4 bg-white text-teal-500 hover:bg-gray-100">
        View Itinerary
      </Button>
    </div>
    <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
      <h3 className="font-bold text-lg mb-3 text-teal-600">Feature Upgrade</h3>
      <ul className="list-disc list-inside text-sm text-gray-700">
        <li className="mb-1">Passport Ticketing</li>
        <li className="mb-1">Flight Ticketing</li>
        <li className="mb-1">Hotel Reservation</li>
        <li className="mb-1">Travel Insurance</li>
        <li>And More!</li>
      </ul>
    </div>
  </>
);


type WeatherData = {
  main: { temp: number };
  weather: { description: string }[];
  name: string;
  sys: { country: string };
};

const Dashboard = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `/api/weather-report?lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          console.log("data : ", data);
          setWeather(data);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  return (
    <div className="min-h-screen max-auto bg-gradient-to-br from-teal-100 to-green-100 p-8 overflow-y-scroll">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-800">
            Welcome back, Traveler!
          </h1>
        </div>

        <div
          className="
          bg-white
          rounded-lg
          shadow
          flex
          flex-row
          items-center
          justify-between
        "
        >
          <Image
            src="/assets/dashboard-bg.jpg"
            alt="alt"
            width={1200}
            height={680}
            className="w-full h-60 object-cover rounded-lg"
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Weather Report</h2>
          {weather && weather.weather && weather.weather.length > 0 ? (
            <div className="flex flex-col items-center space-y-4">
              <p className="text-4xl font-bold">
                {Math.round(weather.main.temp - 273.15)}°C
              </p>
              <p className="text-lg text-muted-foreground">
                {weather.weather[0].description}
              </p>
              <p className="text-sm text-muted-foreground">
                {weather.name}, {weather.sys.country}
              </p>
            </div>
          ) : (
            <p>Loading weather...</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <DashboardCard
            title="Trending Places"
            icon={Trending}
            content={<TrendingPlaces />}
          />
          <DashboardCard
            title="Quick Actions"
            icon={Compass}
            content={<QuickActions />}
          />
          <DashboardCard
            title="Upcoming Trip"
            icon={Calendar}
            content={<UpcomingTrip />}
          />
        </div>

        {/* <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Personalized Recommendations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              "Kyoto, Japan",
              "Machu Picchu, Peru",
              "Santorini, Greece",
              "Iceland",
            ].map((place, index) => (
              <div
                key={index}
                className="relative group overflow-hidden rounded-lg"
              >
                <Image
                  src={`/api/placeholder/300/200?text=${place}`}
                  alt={place}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <p className="text-white font-semibold">{place}</p>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
