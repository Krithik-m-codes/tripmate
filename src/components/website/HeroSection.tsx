"use client"
import Image from "next/image";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <motion.div
      className="container px-6 py-16 mx-auto lg:px-10 max-h-screen min-h-auto"
      id="MainContent"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="items-center md:gap-20 lg:flex">
        <div className="w-full lg:w-1/2 lg:flex lg:justify-center lg:items-center lg:flex-col ">
          {/* Hero content */}
          <div className="lg:max-w-lg lg:flex lg:justify-center lg:items-center lg:flex-col lg:gap-10">
            <h1 className="text-3xl font-semibold text-gray-800 lg:text-5xl lg:text-left">
              Experience Your Next <br />
              Adventure with <span className="text-primary ">TripMate</span>
            </h1>
            <p className="mt-3 text-balance text-gray-700 md:text-lg lg:text-xl">
              TripMate is the ultimate travel companion, Our intuitive <br />
              web app provides a seamless experience for discovering top
              destinations, planning your trip , and getting directions
            </p>
          </div>
        </div>
        {/* Hero image */}
        <div className="flex items-center justify-center w-full mt-6 lg:mt-0 lg:w-1/2">
          <Image
            className="w-full h-full md:max-w-md lg:max-w-xl "
            width={500}
            height={500}
            src="/assets/hero-img.png"
            alt="hero-Image.svg"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default HeroSection;
