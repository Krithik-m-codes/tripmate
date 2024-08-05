"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import FeaturesBenefits from "../FeaturesAndBenefits";

const ServicesAndFeatures = () => {
  return (
    <section
      className="bg-[#f3f7f6] h-auto flex justify-center mt-10 items-center flex-col"
      id="Services"
    >
      {/* Container for section services */}

      <section className="pt-20 pb-12 lg:pt-[120px] lg:pb-[90px] dark:bg-dark">
        <div className="container mx-auto">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="mx-auto mb-12 max-w-[510px] text-center lg:mb-20">
                <span className="text-primary mb-2 block text-lg font-semibold">
                  Our Services
                </span>
                <h2 className="text-dark flex justify-center items-center dark:text-white mb-3 text-3xl leading-[1.2] font-bold sm:text-4xl md:text-[40px]">
                  What We Offer{" "}
                  <span>
                    <Image
                      src="/assets/svg/rocket.svg"
                      alt="rocket"
                      width={50}
                      height={50}
                    />
                  </span>
                </h2>
                <p className="text-body-color text-base dark:text-dark-6">
                  We provide a range of services to help you plan your next
                  adventure. Our platform offers a variety of features to
                  enhance your travel experience and make your trip more
                  enjoyable.
                </p>
              </div>
            </div>
          </div>
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4 md:w-1/2 lg:w-1/3">
              <div className="mb-9 rounded-[20px] bg-white dark:bg-dark-2 p-10 shadow-2 hover:shadow-lg md:px-7 xl:px-10 ">
                <div className="bg-primary mb-8 flex h-[70px] w-[70px] items-center justify-center rounded-2xl">
                  <Image
                    src="/assets/svg/ai.svg"
                    alt="alt"
                    width={50}
                    height={50}
                  />
                </div>
                <h4 className="text-dark dark:text-white mb-[14px] text-2xl font-semibold">
                  AI Trip Planner
                </h4>
                <p className="text-body-color dark:text-dark-6">
                  Leverage our intelligent AI to craft personalized travel
                  itineraries based on your preferences.
                </p>
              </div>
            </div>
            <div className="w-full px-4 md:w-1/2 lg:w-1/3">
              <div className="mb-9 rounded-[20px] bg-white dark:bg-dark-2 p-10 shadow-2 hover:shadow-lg md:px-7 xl:px-10">
                <div className="bg-primary mb-8 flex h-[70px] w-[70px] items-center justify-center rounded-2xl">
                  <Image
                    src="/assets/svg/location.svg"
                    alt="alt"
                    width={50}
                    height={50}
                  />
                </div>
                <h4 className="text-dark dark:text-white mb-[14px] text-2xl font-semibold">
                  Real-Time Location Services
                </h4>
                <p className="text-body-color dark:text-dark-6">
                  Get accurate directions, find nearby attractions, and receive
                  updates about your surroundings to enhance your travel
                  experience.
                </p>
              </div>
            </div>
            <div className="w-full px-4 md:w-1/2 lg:w-1/3">
              <div className="mb-9 rounded-[20px] bg-white dark:bg-dark-2 p-10 shadow-2 hover:shadow-lg md:px-7 xl:px-10">
                <div className="bg-primary mb-8 flex h-[70px] w-[70px] items-center justify-center rounded-2xl">
                  <Image
                    src="/assets/svg/travel-data.svg"
                    alt="alt"
                    width={50}
                    height={50}
                  />
                </div>
                <h4 className="text-dark dark:text-white mb-[14px] text-2xl font-semibold">
                  Travel Data Insights
                </h4>
                <p className="text-body-color dark:text-dark-6">
                  Our platform provides detailed information and reviews to help
                  you make informed decisions about where to go and what to do.
                </p>
              </div>
            </div>
            <div className="w-full px-4 md:w-1/2 lg:w-1/3">
              <div className="mb-9 rounded-[20px] bg-white dark:bg-dark-2 p-10 shadow-2 hover:shadow-lg md:px-7 xl:px-10">
                <div className="bg-primary mb-8 flex h-[70px] w-[70px] items-center justify-center rounded-2xl">
                  <Image
                    src="/assets/svg/map.svg"
                    alt="alt"
                    width={50}
                    height={50}
                  />
                </div>
                <h4 className="text-dark dark:text-white mb-[14px] text-2xl font-semibold">
                  Interactive Map Interface
                </h4>
                <p className="text-body-color dark:text-dark-6">
                  Explore destinations with our interactive map interface that
                  provides detailed information about local attractions.
                </p>
              </div>
            </div>
            <div className="w-full px-4 md:w-1/2 lg:w-1/3">
              <div className="mb-9 rounded-[20px] bg-white dark:bg-dark-2 p-10 shadow-2 hover:shadow-lg md:px-7 xl:px-10">
                <div className="bg-primary mb-8 flex h-[70px] w-[70px] items-center justify-center rounded-2xl">
                  <Image
                    src="/assets/svg/auth-key.svg"
                    alt="alt"
                    width={50}
                    height={50}
                  />
                </div>
                <h4 className="text-dark dark:text-white mb-[14px] text-2xl font-semibold">
                  Secure User Authentication
                </h4>
                <p className="text-body-color dark:text-dark-6">
                  Protect your personal information with secure user
                  authentication and data encryption.
                </p>
              </div>
            </div>
            <div className="w-full px-4 md:w-1/2 lg:w-1/3">
              <div className="mb-9 rounded-[20px] bg-white dark:bg-dark-2 p-10 shadow-2 hover:shadow-lg md:px-7 xl:px-10">
                <div className="bg-primary mb-8 flex h-[70px] w-[70px] items-center justify-center rounded-2xl">
                  <Image
                    src="/assets/svg/update-web.svg"
                    alt="alt"
                    width={50}
                    height={50}
                  />
                </div>
                <h4 className="text-dark dark:text-white mb-[14px] text-2xl font-semibold">
                  Regular Updates
                </h4>
                <p className="text-body-color dark:text-dark-6">
                  Stay informed with regular updates about new features and
                  enhancements to optimize your travel experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Container for section features and benefits */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="h-auto w-full flex justify-center items-center bg-gradient-to-br from-teal-50 to-green-50"
      >
        <FeaturesBenefits />
      </motion.div>
    </section>
  );
};

export default ServicesAndFeatures;
