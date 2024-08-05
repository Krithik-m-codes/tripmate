import React from "react";
import {
  Sailboat,
  MapPin,
  Navigation2,
  Radio,
  CalendarCheck2,
} from "lucide-react";
import Image from "next/image";

const SvgBackground = ({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) => (
  <div className="relative">
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill={color}
        d="M44.9,-76.8C58.9,-69.3,71.5,-58,79.6,-44.1C87.7,-30.1,91.3,-13.4,90.1,2.7C88.9,18.8,82.8,34.3,73.3,47.2C63.8,60.1,50.8,70.3,36.3,76.3C21.7,82.3,5.6,84,-10.8,82.4C-27.2,80.8,-44,75.8,-57.7,66.5C-71.4,57.2,-82.1,43.5,-87.3,28C-92.5,12.4,-92.2,-5,-87.6,-20.8C-83,-36.5,-74.1,-50.6,-61.8,-59.4C-49.5,-68.2,-33.8,-71.7,-19.3,-74.1C-4.8,-76.5,8.5,-77.8,22.4,-78.1C36.3,-78.4,50.8,-77.7,44.9,-76.8Z"
        transform="translate(100 100)"
      />
    </svg>
    <div className="relative z-10">{children}</div>
  </div>
);

const FeatureItem = ({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<any>;
  text: string;
}) => (
  <div className="flex items-center space-x-4 mb-3 pb-2 bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg ">
    <div className="bg-blue-100 p-3 rounded-full">
      <Icon className="w-6 h-6 text-blue-600" />
    </div>
    <span className="text-gray-800 font-medium">{text}</span>
  </div>
);

const BenefitItem = ({ text }: { text: string }) => (
  <div className="flex items-center space-x-4 mb-3 bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg ">
    <div className="bg-yellow-100 p-3 rounded-full">
      <span className="text-2xl">👉</span>
    </div>
    <span className="text-gray-800 font-medium">{text}</span>
  </div>
);

const FeaturesBenefits = () => {
  return (
    <div className=" h-1/2 w-3/4 py-12 px-4 sm:px-6 lg:px-8 self-center bg-transparent">
      <div className=" mx-auto">
        <h1 className="text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-green-800 mb-16">
          Features and Benefits
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="bg-white bg-opacity-70 backdrop-filter backdrop-blur-xl rounded-xl shadow-xl p-4 transform transition-all duration-300">
            <SvgBackground color="rgba(59, 130, 246, 0.1)">
              <h2 className="text-3xl font-bold mb-8 text-blue-600">
                Features
              </h2>
            </SvgBackground>
            <FeatureItem icon={MapPin} text="Intuitive Destination Discovery" />
            <FeatureItem
              icon={CalendarCheck2}
              text="Customized Travel Planning"
            />
            <FeatureItem
              icon={Navigation2}
              text="Effortless Directions Assistance"
            />
            <FeatureItem icon={Radio} text="Real-Time Traffic Updates" />
            <FeatureItem
              icon={Sailboat}
              text="Integrated Travel Reservations"
            />
          </div>
          <div className="bg-white bg-opacity-70 backdrop-filter backdrop-blur-xl rounded-xl shadow-xl p-4 transform transition-all duration-300">
            <SvgBackground color="rgba(255, 196, 0, 0.767)">
              <h2 className="text-3xl font-bold mb-8 text-yellow-500">
                Benefits
              </h2>
            </SvgBackground>
            <BenefitItem text="Stress-Free Travel Planning" />
            <BenefitItem text="Efficient Travel Management" />
            <BenefitItem text="Customized Travel Experiences" />
            <BenefitItem text="Seamless Navigation" />
            <BenefitItem text="Unforgettable Adventures" />
          </div>
          <div className="transform transition-all duration-300 hover:scale-105">
            <Image
              src="/assets/img/travel-01.png"
              width={800}
              height={1000}
              alt="Tropical beach paradise"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesBenefits;
