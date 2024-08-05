"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // handle form submission
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission
    const response = signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });
    if (!response) {
      // console.log(":: response from sign in ::", response);
      console.log("User sign in was not successfully");
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-around  md:justify-center min-h-screen md:gap-8 lg:gap-12 bg-white text-black md:px-20 bg-bg-sign-in bg-cover bg-no-repeat bg-center bg-opacity-70">
      <div className="flex flex-col gap-2 md:gap-8 lg:gap-10 text-left w-auto h-auto md:h-[60%] md:w-1/2 lg:w-[35%] lg:h-[52%] items-center justify-center bg-gray-500 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100">
        <h1 className="text-2xl md:text-5xl mt-4 font-bold">
          Unlock
          <span className="text-orange-400"> Your </span>
          <span className="text-green-400"> Potential </span>
        </h1>
        <p className="text-sm -mt-5 md:text-lg text-gray-700">
          Sign in to your account to continue
        </p>
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col justify-center m-auto items-center w-full h-1/2 md:py-4 md:px-10 lg:p-0 lg:m-0 "
        >
          <div className=" mb-2 md:mb-4 ">
            <label
              htmlFor="email"
              className="block text-gray-700 font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full p-2 md:py-2 md:px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(event) =>
                setFormData({ ...formData, email: event.target.value })
              }
            />
          </div>
          <div className="mb-4 ">
            <label
              htmlFor="password"
              className="block text-gray-700 font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(event) =>
                setFormData({ ...formData, password: event.target.value })
              }
            />
          </div>
          <div>
            <button
              type="submit"
              className="bg-orange-400 px-3 py-1 m-4 rounded "
              onClick={() => signIn("credentials", formData)}
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
