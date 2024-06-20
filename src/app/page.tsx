"use client";
import { useState } from "react";
import Image from "next/image";
// import { logo } from "../assets/index"

export default function Home() {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLinkClick = () => {
    handleClose();
  };

  const handleLoginClick = () => {
    handleClose();
    // redirect to login
    window.location.href = "/sign-in";
  };

  const handleSignupClick = () => {
    handleClose();
    // redirect to signup
    window.location.href = "/signup";
  };

  return (
    <main className="bg-[#F3F7F6] h-auto text-center">
      {/* Header */}
      <header className="flex justify-between p-5 items-center bg-[#FFFFFF] text-[#000000] text-md md:text-xl md:px-[4rem]  lg:px-[12rem] ">
        <div className="flex items-center flex-grow-1 gap-3 ">
          <Image
            src="/tripmate-logo.png"
            alt="tripmate"
            width={50}
            height={50}
            className="w-10 h-10 rounded-full object-cover"
          />
          <h2 className="font-bold">TripMate</h2>
        </div>
        <div className="flex space-x-5 items-center flex-grow-2">
          <ul className="hidden md:inline-flex space-x-5 mx-5">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
          <button
            className="bg-[#166F5B] px-4 py-1 rounded-md text-white"
            onClick={handleSignupClick}
          >
            Sign Up
          </button>
          <button
            className="bg-[#166f5b] px-4 py-1 rounded-md text-white"
            onClick={handleLoginClick}
          >
            Login
          </button>
        </div>

        {/* burger menu icon  */}
        <div className="md:hidden flex items-center">
          <button onClick={handleClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        {/* small screen nav menu */}
        <div
          className={`md:hidden absolute top-0 left-0 w-full h-full bg-[#FFFFFF] text-[#000000] ${
            open ? "block" : "hidden"
          }`}
        >
          <button
            className="absolute top-5 right-5 text-5xl"
            onClick={handleClose}
          >
            x
          </button>
          <ul className="flex flex-col items-center justify-center h-full">
            <li className="py-4">
              <a href="/" onClick={handleLinkClick}>
                Home
              </a>
            </li>
            <li className="py-4">
              <a href="/about" onClick={handleLinkClick}>
                About
              </a>
            </li>
            <li className="py-4">
              <a href="/contact" onClick={handleLinkClick}>
                Contact
              </a>
            </li>
          </ul>
        </div>
      </header>
      {/* header section */}

      {/* Hero section content */}
      <div className="container px-6 py-16 mx-auto lg:px-10 max-h-screen min-h-auto">
        <div className="items-center md:gap-20 lg:flex">
          <div className="w-full lg:w-1/2 lg:flex lg:justify-center lg:items-center lg:flex-col ">
            {/* Hero content */}
            <div className="lg:max-w-lg lg:flex lg:justify-center lg:items-center lg:flex-col lg:gap-10">
              <h1 className="text-3xl font-semibold text-gray-800 lg:text-5xl lg:text-left">
                Experience Your Next <br />
                Adventure with <span className="text-[#166f5b] ">TripMate</span>
              </h1>
              <p className="mt-3 text-gray-700 md:text-lg lg:text-xl">
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
      </div>

      {/* Featured in section  */}
      <section className="bg-white text-black max-h-[50%] ">
        <div className="container px-6 py-7 md:py-12 mx-auto lg:flex flex-auto">
          <div className="my-5 text-center md:my-0 lg:my-0 lg:block lg:w-1/2 md:max-w-[25%] ">
            <h1 className="text-3xl font-semibold underline decoration-[#166f5b] bg-[#166f5b] p-2 text-white">
              Featured In
            </h1>
          </div>
          <br className="sm:hidden " />
          <div className="grid grid-cols-2 place-items-center gap-10 md:grid-cols-2 lg:grid-cols-4 md:mx-auto">
            <div>
              <Image
                src="/logoipsum-265.svg"
                width={119}
                height={119}
                className="w-full"
                alt="logo1"
              />
            </div>

            <div>
              <Image
                src="/logoipsum-287.svg"
                width={119}
                height={119}
                className="w-full"
                alt="logo2"
              />
            </div>

            <div>
              <Image
                src="/logoipsum-317.svg"
                width={119}
                height={119}
                className="w-[119px] sm:w-full "
                alt="logo3"
              />
            </div>
            <div>
              <Image
                src="/logoipsum-325.svg"
                width={119}
                height={119}
                className="w-[119px] sm:w-full"
                alt="logo4"
              />
            </div>
          </div>
        </div>
      </section>
      {/* featured section ends here  */}

      {/* Services section starts here  */}
      <section className="bg-[#F3F7F6] h-auto flex justify-center mt-10 items-center flex-col ">
        {/* Container for header and button */}
        <div className="container md:px-[9.5rem] px-10 sm:text-sm md:text-lg py-10 mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-4xl font-semibold text-left text-black underline decoration-[#166f5b] ">
              Our Services
            </h1>
          </div>
          <div>
            <button className="bg-[#166f5b] text-white px-3 py-1 md:px-6 md:py-3 rounded">
              Get Started
            </button>
          </div>
        </div>

        {/* Container for sections with images  and text */}
        <div className="bg-white sm:w-[95%] my-10 rounded-md">
          <div className="container flex flex-col-reverse px-6 gap-8 md:gap-0 py-4 mx-auto space-y-6 lg:h-[32rem] lg:py-16 lg:flex-row-reverse lg:items-center">
            <div className="flex flex-col items-center w-full lg:flex-row lg:w-1/2">
              <div className="max-w-lg lg:mx-12 lg:order-2">
                <h1 className="text-3xl font-semibold tracking-wide text-black  lg:text-4xl">
                  Directions Assistance
                </h1>
                <p className="mt-4 text-gray-900">
                  Get to your destination with ease and <br />
                  confidence with our directions assistance service
                </p>
                <div className="mt-6">
                  <a
                    href="#"
                    className="px-6 py-2.5 mt-6 text-sm font-medium leading-5 text-center text-white capitalize bg-blue-600 rounded-lg hover:bg-blue-500 lg:mx-0 lg:w-auto focus:outline-none"
                  >
                    Read more
                  </a>
                </div>
              </div>
            </div>
            {/* image container */}
            <div className="flex items-center shadow-md md:shadow-none rounded-md justify-center w-full h-96 lg:w-1/2">
              <Image
                src="/assets/direction-asst-img.png"
                alt="directions image"
                width={500}
                height={500}
                className="object-cover w-full h-full max-w-2xl rounded-md"
              />
            </div>
          </div>

          {/* Container for sections with images  and text */}
          <div className="container flex flex-col-reverse gap-8 md:gap-0 px-6 py-4 mx-auto space-y-6 lg:h-[32rem] lg:py-16 lg:flex-row lg:items-center">
            <div className="flex flex-col items-center  w-full lg:flex-row lg:w-1/2">
              <div className="max-w-lg lg:mx-12 lg:order-2">
                <h1 className="text-3xl font-semibold tracking-wide text-black lg:text-4xl">
                  Travel Planning
                </h1>
                <p className="mt-4 text-gray-900">
                  Leave the stress of travel planning behind and <br />
                  let us create a seamless itinerary for your next adventure
                </p>
                <div className="mt-6">
                  <a
                    href="#"
                    className="px-6 py-2.5 mt-6 text-sm font-medium leading-5 text-center text-white capitalize bg-blue-600 rounded-lg hover:bg-blue-500 lg:mx-0 lg:w-auto focus:outline-none"
                  >
                    Read more{" "}
                  </a>
                </div>
              </div>
            </div>
            {/* image container */}
            <div className="flex items-center shadow-md md:shadow-none rounded-md justify-center w-full h-96 lg:w-1/2">
              <Image
                src="/assets/travel-planning-img.webp"
                alt="travel planning image"
                width={500}
                height={500}
                className="object-cover w-full h-full max-w-2xl rounded-md"
              />
            </div>
          </div>

          {/* Container for sections with images  and text */}
          <div className="container flex flex-col-reverse gap-8 md:gap-0 px-6 py-4 mx-auto space-y-6 lg:h-[32rem] lg:py-16 lg:flex-row-reverse lg:items-center">
            <div className="flex flex-col items-center w-full lg:flex-row lg:w-1/2">
              <div className="max-w-lg lg:mx-12 lg:order-2">
                <h1 className="text-3xl font-semibold tracking-wide text-black  lg:text-4xl">
                  Find Hidden Attractions{" "}
                </h1>
                <p className="mt-4 text-gray-900">
                  Discover hidden gems with our search engine and <br />
                  find the perfect spot for your next adventure
                </p>
                <div className="mt-6">
                  <a
                    href="#"
                    className="px-6 py-2.5 mt-6 text-sm font-medium leading-5 text-center text-white capitalize bg-blue-600 rounded-lg hover:bg-blue-500 lg:mx-0 lg:w-auto focus:outline-none"
                  >
                    Read more{" "}
                  </a>
                </div>
              </div>
            </div>
            {/* image container */}
            <div className="flex items-center shadow-md md:shadow-none rounded-md justify-center w-full h-96 lg:w-1/2">
              <Image
                src="/assets/find-attraction-img.png"
                alt="direction discovery image"
                width={500}
                height={500}
                className="object-cover w-full h-full max-w-2xl rounded-md"
              />
            </div>
          </div>
        </div>
        {/* Container for section features and benefits */}
        <div>
          <div>
            <h1>Features and Benefits</h1>
          </div>
        </div>
      </section>
      {/* Services section ends here  */}

      {/* Footer section */}
      <footer className="bg-black text-white">
        <div className="flex gap-6 my-3 items-center justify-center">
          <Image
            src="/tripmate-logo.png"
            alt="tripmate logo"
            width={50}
            height={50}
            className="rounded-full"
          />
          <h2>TripMate</h2>
        </div>
        <p>Copyright &copy; 2023 TripMate. All rights reserved.</p>
        <div className="flex justify-center gap-4">
          <p>Powered by Next js</p>
          <p>Developed by Krithik M</p>
        </div>
      </footer>
    </main>
  );
}
