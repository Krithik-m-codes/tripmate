"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SignInPage() {
  // const { data: session } = useSession();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();

  // handle form submission
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission
    console.log("Form submitted");
    const response = signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });
    if (response) {
      console.log(response);
      console.log("User signed in successfully");
    } else {
      console.log("Failed to sign in");
    }

    // redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-around md:justify-center h-screen md:gap-8 bg-white text-black md:px-20">
      <div className="flex items-center justify-center h-[40%] md:w-1/2">
        <Image
          src="/sign-in-image.jpeg"
          alt="Sign In"
          width={1200}
          height={1000}
          className="w-[95%] h-[80%] md:w-full md:h-full md:object-cover object-center rounded-lg"
        />
      </div>
      <div className="flex flex-col gap-2 md:gap-8 text-left h-[60%] md:w-1/2 items-center justify-center">
        <h1 className="text-3xl md:text-5xl font-bold">TripMate</h1>
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col justify-center items-center w-full h-1/2 md:py-4 md:px-10 "
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
            <button
              type="submit"
              className="bg-green-400 px-3 py-1 m-4 rounded "
              onClick={() => {
                return (window.location.href = "/sign-up");
              }}
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
