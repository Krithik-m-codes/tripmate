"use client";
import Image from "next/image";
import { motion } from "framer-motion";

const FeaturedIn = () => {
  return (
    <section className="bg-white text-black max-h-[50%] ">
      <motion.div
        className="container px-6 py-7 md:py-12 mx-auto lg:flex flex-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="my-5 text-center md:my-0 lg:my-0 lg:block lg:w-1/2 md:max-w-[25%] ">
          <h1 className="text-4xl font-bold p-2 text-primary ">
            Featured In :
          </h1>
        </div>
        <br className="sm:hidden " />
        <div className="grid grid-cols-2 place-items-center gap-10 md:grid-cols-2 lg:grid-cols-4 md:mx-auto">
          <div>
            <Image
              src="/assets/logos/logoipsum-265.svg"
              width={119}
              height={119}
              className="w-full"
              alt="logo1"
            />
          </div>

          <div>
            <Image
              src="/assets/logos/logoipsum-287.svg"
              width={119}
              height={119}
              className="w-full"
              alt="logo2"
            />
          </div>

          <div>
            <Image
              src="/assets/logos/logoipsum-317.svg"
              width={119}
              height={119}
              className="w-[119px] sm:w-full "
              alt="logo3"
            />
          </div>
          <div>
            <Image
              src="/assets/logos/logoipsum-325.svg"
              width={119}
              height={119}
              className="w-[119px] sm:w-full"
              alt="logo4"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default FeaturedIn;
