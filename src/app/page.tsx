"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TeamMember from "../components/TeamMember";

// import { logo } from "../assets/index"

export default function Home() {
  const [open, setOpen] = useState(false);

  const router = useRouter();

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
    router.push("/sign-in");
  };

  const handleSignupClick = () => {
    handleClose();
    // redirect to signup
    router.push("/sign-up");
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
              <a href="#MainContent">About</a>
            </li>
            <li>
              <a href="#Services">Services</a>
            </li>
          </ul>
          <button
            className="bg-[#166F5B] px-2 py-1 md:px-4 md:py-1 rounded-md text-white hover:bg-black "
            onClick={handleSignupClick}
          >
            Sign Up
          </button>
          <button
            className="bg-[#166f5b] px-2 py-1 mr-2 md:mr-0 md:px-4 md:py-1 rounded-md text-white hover:bg-black  "
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
          className={`md:hidden absolute top-0 left-0 w-full h-full bg-gradient-to-b from-emerald-500 to-emerald-900 text-[#ffff] ${
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
            <li className="py-1 flex items-center justify-center gap-2">
              <Image
                src="/tripmate-logo.png"
                alt="alt"
                width={60}
                height={80}
                className=" rounded-full"
              />
              <h2 className="text-3xl font-bold text-black">TripMate</h2>
            </li>
            <li className="pb-10 text-center">
              <p>Travel begins within oneself</p>
            </li>
            <li className="py-4">
              <a
                href="/"
                onClick={handleLinkClick}
                className="border-b-4 border-yellow-400 p-2 rounded-md hover:bg-yellow-200 hover:text-black"
              >
                Home
              </a>
            </li>
            <li className="py-4">
              <a
                href="#MainContent"
                onClick={handleLinkClick}
                className=" border-b-4 border-yellow-400 p-2 rounded-md hover:bg-yellow-200 hover:text-black"
              >
                About
              </a>
            </li>
            <li className="py-4">
              <a
                href="#Services"
                onClick={handleLinkClick}
                className=" border-b-4 border-yellow-400 p-2 rounded-md hover:bg-yellow-200 hover:text-black"
              >
                Services
              </a>
            </li>
          </ul>
        </div>
      </header>
      {/* header section */}

      {/* Hero section content */}
      <div
        className="container px-6 py-16 mx-auto lg:px-10 max-h-screen min-h-auto"
        id="MainContent"
      >
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
      <section
        className="bg-[#F3F7F6] h-auto flex justify-center mt-10 items-center flex-col"
        id="Services"
      >
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
                <div className="mt-6 hidden mb-3 md:mb-0 md:block ">
                  <a
                    href="#"
                    className="px-6 py-2.5 mt-6 text-sm font-medium leading-5 text-center text-white capitalize bg-[#166F5B] rounded-lg hover:bg-[#46ff77] lg:mx-0 lg:w-auto focus:outline-none"
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
                className="object-cover w-full h-full max-w-2xl rounded-md md:shadow-2xl"
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
                  Leave the stress of travel planning behind <br />
                  , let us create a seamless itinerary for your next adventure
                </p>
                <div className="mt-6 hidden mb-3 md:mb-0 md:block ">
                  <a
                    href="#"
                    className="px-6 py-2.5 mt-6 text-sm font-medium leading-5 text-center text-white capitalize bg-[#166F5B] rounded-lg hover:bg-[#46ff77] lg:mx-0 lg:w-auto focus:outline-none"
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
                className="object-cover w-full h-full max-w-2xl rounded-md md:shadow-2xl"
              />
            </div>
          </div>

          {/* Container for sections with images  and text */}
          <div className="container flex flex-col-reverse gap-8 md:gap-0 px-6 py-4 mx-auto space-y-6 lg:h-[32rem] lg:py-16 lg:flex-row-reverse lg:items-center">
            <div className="flex flex-col items-center w-full lg:flex-row lg:w-1/2">
              <div className="max-w-lg lg:mx-12 lg:order-2">
                <h1 className=" text-3xl font-semibold tracking-wide text-black lg:text-4xl">
                  Find Hidden Attractions{" "}
                </h1>
                <p className="mt-4 text-gray-900">
                  Discover hidden gems with our search engine <br />, find the
                  perfect spot for your next adventure
                </p>
                <div className="mt-6 hidden mb-3 md:mb-0 md:block ">
                  <a
                    href="#"
                    className="px-6 py-2.5 mt-6 text-sm font-medium leading-5 text-center text-white capitalize bg-[#166F5B] rounded-lg hover:bg-[#46ff77] lg:mx-0 lg:w-auto focus:outline-none"
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
                alt="Find attractions image"
                width={500}
                height={500}
                className="object-cover w-full h-full max-w-2xl rounded-md md:shadow-2xl"
              />
            </div>
          </div>
        </div>
        {/* Container for section features and benefits */}
        <div className="container mx-auto py-8 text-black">
          <h2 className="text-center text-xl font-bold mb-4">
            Features & Benefits
          </h2>
          <div className="border-b-2 border-black mb-8"></div>
          <div className="flex flex-col sm:flex-row justify-between items-center ">
            <div className="flex-1 p-4 border-b-2 border-yellow-500 md:border-none">
              <h3 className="text-left md:text-center font-bold text-lg">
                Features
              </h3>
              <ul className="text-left md:text-center mt-2 space-y-2">
                <li>👉 Intuitive Destination Discovery</li>
                <li>👉 Customized Travel planning</li>
                <li>👉 Effortless Directions Assistance</li>
                <li>👉 Real-Time Traffic Updates</li>
                <li>👉 Integrated Travel Reservations</li>
              </ul>
            </div>
            <div className="flex-1 p-4">
              <h3 className="text-right md:text-center font-bold text-lg">
                Benefits
              </h3>
              <ul className="text-right md:text-center mt-2 space-y-2">
                <li>Stress-Free Travel Planning 👈 </li>
                <li>Efficient travel management 👈 </li>
                <li>Customized travel experiences 👈 </li>
                <li>Seamless navigation 👈 </li>
                <li>Unforgettable adventures 👈 </li>
              </ul>
            </div>
            <div className="flex-1 p-4">
              <Image
                src="/assets/hero-img.png"
                width={500}
                height={500}
                alt="Scenic view"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>
      {/* Services section ends here  */}

      {/* Team section starts here  */}
      <div className="bg-gray-50 text-black py-8 border-y-4 " id="OurTeam">
        <div className="container mx-auto text-center ">
          <h2 className="text-xl font-bold mb-4">Our Team</h2>
          <p className="text-gray-700 mb-8">
            Meet the Experts, The passionate Tripmate Team Dedicated to
            Enhancing Your travel experience
          </p>
          <br />
          <div className="grid grid-cols-1 m-auto md:grid-cols-1 gap-6 lg:gap-0 place-items-center ">
            <TeamMember
              name="Krithik M"
              title="Full Stack Developer"
              vision="Vision for tripmate has been to create seamless hassle free travel experiences for customers, expertise in travel made him a respected leader in the industry"
              imageSrc="/assets/team_member_1.jpeg"
            />
          </div>
        </div>
      </div>
      {/* Team section ends here  */}

      {/* Footer Section will be here */}
      <footer className="bg-[#F3F7F6]">
        <div className="relative mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 lg:pt-24">
          <div className="absolute end-4 top-4 sm:end-6 sm:top-6 lg:end-8 lg:top-8">
            <a
              className="inline-block rounded-full bg-teal-600 p-2 text-white shadow transition hover:bg-teal-500 sm:p-3 lg:p-4"
              href="#MainContent"
            >
              <span className="sr-only">Back to top</span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>

          <div className="lg:flex lg:items-end lg:justify-between">
            <div>
              <div className="flex justify-center items-center space-x-4  text-teal-600 lg:justify-start">
                <Image
                  src="/tripmate-logo.png"
                  alt="tripmate logo"
                  width={100}
                  height={100}
                  className="w-24 h-24 rounded-full"
                />
                <h2 className="ml-3 text-xl md:text-3xl font-bold ">
                  Tripmate
                </h2>
              </div>

              <p className="mx-auto mt-6 max-w-md text-center leading-relaxed text-gray-500 lg:text-left">
                TripMate is a travel app that helps you plan your trips, save
                your favorite places and share them with your friends. and much
                more !
              </p>
            </div>

            <ul className="mt-12 flex flex-wrap justify-center gap-6 md:gap-8 lg:mt-0 lg:justify-end lg:gap-12">
              <li>
                <a
                  className="text-gray-700 transition hover:text-gray-700/75"
                  href="#MainContent"
                >
                  {" "}
                  About{" "}
                </a>
              </li>

              <li>
                <a
                  className="text-gray-700 transition hover:text-gray-700/75"
                  href="#Services"
                >
                  {" "}
                  Services{" "}
                </a>
              </li>

              <li>
                <a
                  className="text-gray-700 transition hover:text-gray-700/75"
                  href="#OurTeam"
                >
                  {" "}
                  Meet the team{" "}
                </a>
              </li>

              <li>
                <a
                  className="text-gray-700 transition hover:text-gray-700/75"
                  href="#MainContent"
                >
                  {" "}
                  Get started{" "}
                </a>
              </li>
            </ul>
          </div>

          <p className="mt-12 text-center text-sm text-gray-500 lg:text-right">
            Copyright &copy; 2024. All rights reserved. By {"  "}
            <a href="#" className="text-[#166F5B] hover:text-[#46ff77]">
              Krithik M
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
