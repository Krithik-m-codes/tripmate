"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import { toast, ToastOptions } from "react-toastify";

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const notifyFailure = () =>
    toast("User sign in was not successfully", { position: "top-right" });
  const notifySuccess = () =>
    toast("User sign in was successfully", { position: "top-right" });
  const testing = () => toast("Testing");

  // handle form submission
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      console.log("🚀 ~ handleFormSubmit ~ response", response);

      if (response && !response.error) {
        const options: ToastOptions = {
          position: "top-right", // Toast position
        };
        notifySuccess();
      } else {
        notifyFailure();
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-around  md:justify-center min-h-screen md:gap-8 lg:gap-12 bg-white text-black md:px-20 bg-bg-sign-in bg-cover bg-no-repeat bg-center bg-opacity-70">
      <div className="md:block w-1/2 h-1/2">
        <Image
          src="/assets/svg/sign-in-illustration.svg"
          alt="Sign in image"
          width={500}
          height={500}
          className="rounded-md"
        />
      </div>
      <div className="flex flex-col gap-2 md:gap-8 lg:gap-10 text-left w-auto h-auto md:h-[60%] md:w-1/2 lg:w-[22%] lg:h-[47%] items-center justify-center bg-gray-600 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100">
        <div className="flex justify-center items-center my-8 gap-2 ">
          <Image
            src="/tripmate-logo.png"
            alt="Tripmate logo"
            width={60}
            height={60}
            className="rounded-full"
          />
          <h1 className="text-3xl md:text-4xl font-bold text-center">
            TripMate
          </h1>
        </div>
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col justify-center m-auto items-center w-full h-1/2 md:py-4 md:px-10 "
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
          <div className="flex flex-col justify-center items-center gap-2 md:gap-4">
            <a
              href="/forgot-password"
              className="text-primary-400 hover:underline"
            >
              Forgot password?
            </a>
            <button
              type="submit"
              className="bg-orange-400 px-3 py-1 m-4 rounded "
              onClick={() => signIn("credentials", formData)}
            >
              Sign in
            </button>
          </div>
        </form>
        <div className="flex justify-center items-center gap-2 mb-4">
          <p>Don&apos;t have an account?</p>
          <a href="/sign-up" className="text-primary-400 hover:underline">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
