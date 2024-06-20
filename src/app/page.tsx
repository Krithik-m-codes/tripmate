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
                TripMate is the ultimate travel companion, Our intiuitive <br />
                web app provides a seamless experience for discovering top
                destiantions, palnning you rtrip , and getting directions
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
    </main>
  );
}
