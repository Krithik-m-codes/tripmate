import React from "react";

const RequestFeature = () => {
  return (
    <div className="min-h-screen bg-[#f3f7f6] bg-gradient-to-b from-green-200 to-blue-900 py-12 md:py-24 ">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-center text-black sm:text-4xl dark:text-white">
            Request a Feature
          </h2>
          <p className="max-w-xl mx-auto mt-3 text-gray-900 sm:mt-6 text-md sm:text-lg sm:leading-snug dark:text-gray-300">
            We are constantly improving our services, let us know what you need
            and we&apos;ll make it happen ;){" "}
          </p>
        </div>
        <div className="mt-10">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLScuBtSg7dQG2mJMc0fnzYigEE9HG0r80gee-J5D_3rdiVquqw/viewform?embedded=true"
            width="640"
            height="1383"
            className="mx-auto"
          >
            Loading…
          </iframe>
        </div>
      </div>
    </div>
  );
};

export default RequestFeature;
