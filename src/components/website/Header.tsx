"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// Desc: Header component for website
export default function Header() {
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
    <header className="flex justify-between p-5 items-center bg-[#FFFFFF] text-[#000000] text-md md:text-xl md:px-[4rem]  lg:px-[12rem] ">
      <div
        className="flex items-center flex-grow-1 gap-3 cursor-pointer "
        onClick={() => router.push("/")}
      >
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
            <a href="/services">Services</a>
          </li>
        </ul>
        <button
          className="bg-primary px-2 py-1 hidden md:block md:px-4 md:py-1 rounded-md text-white hover:bg-black transition delay-150 duration-300 ease-in-out "
          onClick={handleSignupClick}
        >
          Sign Up
        </button>
        <button
          className="bg-primary px-2 py-1 hidden md:block  mr-2 md:mr-0 md:px-4 md:py-1 rounded-md text-white hover:bg-black transition delay-150 duration-300 ease-in-out "
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className={`md:hidden absolute top-0 left-0 w-full h-full bg-gray-700 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 text-[#000000] ${
          open ? "block" : "hidden"
        }`}
      >
        <button
          className="absolute top-5 right-5 text-5xl"
          onClick={handleClose}
        >
          x
        </button>
        <ul className="flex flex-col items-center justify-center h-full text-black">
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
          <li className="py-4 rounded-sm">
            <a
              href="/"
              onClick={handleLinkClick}
              className="border-b-4 font-bold border-yellow-400 p-2 rounded-md hover:bg-yellow-200 hover:text-black"
            >
              Home
            </a>
          </li>
          <li className="py-4 rounded-sm">
            <a
              href="/about"
              onClick={handleLinkClick}
              className=" border-b-4 font-bold border-yellow-400 p-2 rounded-md hover:bg-yellow-200 hover:text-black"
            >
              About
            </a>
          </li>
          <li className="py-4 rounded-sm">
            <a
              href="/services"
              onClick={handleLinkClick}
              className=" border-b-4 font-bold border-yellow-400 p-2 rounded-md hover:bg-yellow-200 hover:text-black"
            >
              Services
            </a>
          </li>
          <li className="py-4 w-full flex gap-4 justify-center items-center m-3">
            <button
              className="bg-primary px-2 py-1 w-[85px] rounded-md text-white hover:bg-black"
              onClick={handleSignupClick}
            >
              Sign Up
            </button>
            <button
              className="bg-primary px-2 py-1 w-[85px] rounded-md text-white hover:bg-black"
              onClick={handleLoginClick}
            >
              Login
            </button>
          </li>
        </ul>
      </motion.div>
    </header>
  );
}
