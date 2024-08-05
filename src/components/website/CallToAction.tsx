"use client";
import Image from "next/image";
import { motion } from "framer-motion";

const CallToAction = () => {
  return (
    <section className="py-12 md:py-24">
      <motion.div
        className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="shadow rounded-xl">
          <div className="grid overflow-hidden text-white shadow-xl md:grid-cols-2 bg-primary rounded-xl">
            <aside className="p-8 space-y-4 md:p-16">
              <h2 className="text-2xl font-bold tracking-tight md:text-4xl font-headline">
                Ready to dive in? Start your journey today.
              </h2>

              <p className="font-medium text-blue-100 md:text-2xl">
                Get started with TripMate today and experience the world like
                never before.
              </p>

              <div>
                <a
                  href="/sign-up"
                  className="bg-white text-teal-600 px-4 py-2 mt-3 rounded-xl hover:bg-teal-600 hover:text-white transition ease-in-out duration-200"
                >
                  Get Started
                </a>
              </div>
            </aside>

            <aside className="relative hidden md:block">
              <Image
                className="absolute inset-0 object-cover object-left-top w-full h-full mt-16 -mr-16 rounded-tl-lg"
                src="/assets/cta-img.jpg"
                alt="Discover our beautiful panel"
                width={500}
                height={500}
              />
            </aside>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CallToAction;
