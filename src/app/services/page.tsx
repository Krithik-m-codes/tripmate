import React from "react";
import Image from "next/image";
import { Cpu, MapPin, Palmtree, Map, Shield, RefreshCw } from "lucide-react";

interface ServiceCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  imageUrl: string;
  info: string;
}

const ServiceCard = ({
  icon: Icon,
  title,
  description,
  imageUrl,
  info,
}: ServiceCardProps) => (
  <div className="group relative overflow-hidden rounded-xl h-auto md:h-[350px] transition-all duration-300 hover:shadow-xl hover:scale-105">
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-800 opacity-0 transition-opacity group-hover:opacity-95">
      <p className="text-white mx-10 my-12 opacity-100 font-semibold md:text-base lg:text-lg">
        {info}
      </p>
    </div>
    <Image
      src={imageUrl}
      width={900}
      height={1100}
      alt={title}
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 p-6 flex flex-col justify-end">
      <div className="flex items-center mb-3">
        <Icon className="w-8 h-8 mr-3 text-white" />
        <h3 className="md:text-base lg:text-3xl shadow-lg font-bold text-white">
          {title}
        </h3>
      </div>
      <p className="text-gray-900 bg-white px-2 py-4 text-xs md:text-sm lg:text-base rounded-lg ">
        {description}
      </p>
    </div>
  </div>
);

const WaveSVG = ({ color }: { color: string }) => (
  <svg
    className="absolute bottom-0 left-0 w-full"
    viewBox="0 0 1440 320"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill={color}
      fillOpacity="0.2"
      d="M0,192L60,186.7C120,181,240,171,360,170.7C480,171,600,181,720,197.3C840,213,960,235,1080,229.3C1200,224,1320,192,1380,176L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
    ></path>
  </svg>
);

const ServicesPage = () => {
  const services = [
    {
      icon: Cpu,
      title: "AI Trip Planner",
      description:
        "Craft personalized travel itineraries with our intelligent AI based on your preferences.",
      imageUrl: "/assets/img/services-img/ai-trip-robot.jpeg",
      info: "AI Trip Planner is a cutting-edge tool that uses machine learning to create personalized travel itineraries based on your preferences. Whether you're a foodie, history buff, or adventure seeker, our AI will craft the perfect trip for you. Simply input your interests, budget, and travel dates, and let our AI do the rest. With AI Trip Planner, you'll discover new destinations, find hidden gems, and make unforgettable memories.",
    },
    {
      icon: MapPin,
      title: "Real-Time Location",
      description:
        "Get accurate directions and find nearby attractions to enhance your travel experience.",
      imageUrl: "/assets/img/services-img/real-time-loc.png",
      info: "Real-Time Location is a feature that uses GPS technology to provide accurate directions and information about nearby attractions. Whether you're exploring a new city or hiking in the mountains, Real-Time Location will help you navigate with ease. With detailed maps and real-time updates, you'll never get lost again. Plus, you can discover hidden gems and local hotspots to make the most of your trip. Real-Time Location is your ultimate travel companion.",
    },
    {
      icon: Palmtree,
      title: "Travel Insights",
      description:
        "Access detailed information and reviews to make informed decisions about your trips.",
      imageUrl: "/assets/img/services-img/travel-insights.jpg",
      info: "Travel Insights is a feature that provides detailed information and reviews to help you make informed decisions about your trips. Whether you're planning a weekend getaway or a month-long adventure, Travel Insights has you covered. From hotel ratings to restaurant recommendations, you'll have all the information you need to plan the perfect trip. Plus, with real-time updates and user-generated content, you'll always stay up-to-date on the latest travel trends. Travel Insights is your go-to source for all things travel-related.",
    },
    {
      icon: Map,
      title: "Interactive Maps",
      description:
        "Explore destinations with our interactive map interface showing local attractions.",
      imageUrl: "/assets/img/services-img/interactive-map.jpg",
      info: "Interactive Maps is a feature that allows you to explore destinations with ease. Whether you're planning a road trip or a city tour, Interactive Maps will help you discover local attractions and hidden gems. With detailed maps and interactive features, you can customize your itinerary and find the best routes to your destination. Plus, with real-time updates and user-generated content, you'll always have the latest information at your fingertips. Interactive Maps is your ultimate travel companion.",
    },
    {
      icon: Shield,
      title: "Secure Auth",
      description:
        "Protect your information with secure authentication and data encryption.",
      imageUrl: "/assets/img/services-img/secure-auth.jpg",
      info: "Secure Auth is a feature that protects your information with secure authentication and data encryption. Whether you're booking a flight or reserving a hotel room, Secure Auth ensures that your personal data is safe and secure. With advanced security measures and real-time monitoring, you can trust that your information is protected at all times. Secure Auth is your peace of mind when it comes to online transactions and data security.",
    },
    {
      icon: RefreshCw,
      title: "Regular Updates",
      description:
        "Stay informed about new features and enhancements to optimize your experience.",
      imageUrl: "/assets/img/services-img/updates.jpg",
      info: "Regular Updates is a feature that keeps you informed about new features and enhancements to optimize your experience. Whether you're a frequent traveler or planning your first trip, Regular Updates will help you stay up-to-date on the latest trends and technologies. With real-time notifications and user-friendly interfaces, you'll always know about new features and improvements. Regular Updates is your go-to source for all things travel-related.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb:10 md:mb-16 lg:mb-24 ">
        <h1 className="text-5xl font-extrabold text-center text-emerald-800 mb-8">
          Discover Our Services
        </h1>
        <p className="text-xl text-center text-emerald-600 mb-16 max-w-3xl mx-auto">
          Embark on unforgettable journeys with our cutting-edge travel
          services. From AI-powered planning to real-time insights, we&rsquo;ve
          got everything you need for the perfect adventure.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
      <div className="absolute -bottom-4 left-0 w-full">
        <WaveSVG color="#047857" />
        <WaveSVG color="#0f766e" />
      </div>
    </div>
  );
};

export default ServicesPage;
