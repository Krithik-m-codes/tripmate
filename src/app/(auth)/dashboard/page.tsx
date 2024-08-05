import React from "react";
import {
  TrendingUp as Trending,
  Compass,
  Calendar,
  Bell,
  Settings,
  User,
  Map,
  PlaneTakeoff,
  Hotel,
  Utensils,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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
  <div className="space-y-4">
    {["Paris, France", "Bali, Indonesia", "Tokyo, Japan", "New York, USA"].map(
      (place, index) => (
        <div key={index} className="flex items-center">
          <Image
            src={`/api/placeholder/50/50?text=${place}`}
            alt={place}
            width={50}
            height={50}
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <p className="font-semibold">{place}</p>
            <p className="text-sm text-muted-foreground">
              Trending #{index + 1}
            </p>
          </div>
        </div>
      )
    )}
  </div>
);

const QuickActions = () => (
  <div className="grid grid-cols-2 gap-4">
    {[
      { icon: PlaneTakeoff, label: "Book Flight" },
      { icon: Hotel, label: "Find Hotel" },
      { icon: Utensils, label: "Restaurants" },
      { icon: Map, label: "Attractions" },
    ].map(({ icon: Icon, label }, index) => (
      <Button key={index} variant="outline" className="h-20 flex-col">
        <Icon className="h-6 w-6 mb-2" />
        {label}
      </Button>
    ))}
  </div>
);

const UpcomingTrip = () => (
  <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-lg p-4 text-white">
    <h3 className="font-bold text-lg mb-2">Your Next Adventure</h3>
    <p className="mb-2">Santorini, Greece</p>
    <p className="text-sm">Departure: August 15, 2024</p>
    <Button variant="secondary" className="mt-4">
      View Itinerary
    </Button>
  </div>
);

const Dashboard = () => {
  return (
    <div className="min-h-screen max-h-max bg-gradient-to-br from-gray-100 to-gray-200 p-8 overflow-y-scroll">
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
          p-2
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
            height={380}
            className="w-full h-52 object-cover rounded-lg"
          />
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

        <div className="bg-white rounded-lg shadow p-6">
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
