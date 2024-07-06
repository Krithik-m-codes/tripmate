"use client";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// function to get the user profile
export default function ProfilePage() {
  const [response, setResponse] = useState(null);
  const { data: session } = useSession();
  // const [userData, setUserData] = useState(null);
  const router = useRouter();
  useEffect(() => {
    const getProfile = async () => {
      const response = await fetch("/api/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      setResponse(await response.json());
      console.log("Response : ", response);
    };
    getProfile();
  }, []);

  if (!session)
    return (
      <div className="text-2xl h-screen w-full flex flex-col gap-6 justify-center items-center absolute top-0 left-0 right-0 bottom-0 bg-black text-white">
        <h3>Not signed in</h3>
        <p>You need to be signed in to access this page</p>
        <button
          className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded "
          onClick={() => router.push("/sign-in")}
        >
          Sign In
        </button>
      </div>
    );
  return (
    <div className="w-full h-screen bg-[#F3F7F6] ">
      <h1 className="text-2xl w-full bg-[#166F5B] text-center text-white py-4 ">
        Profile
      </h1>
      <div className="flex flex-col items-center justify-center gap-4 p-4">
        <div className="bg-white rounded-lg shadow-md p-4 h-auto w-1/2  flex justify-center items-center gap-2 md:gap-5">
          <div>
            <h2 className="text-xl font-bold">User Profile</h2>
            <p className="text-gray-500">Name: {session.user.name}</p>
            <p className="text-gray-500">Email: {session.user.email}</p>
            <p className="text-gray-500">
              {session.user.isVerified ? (
                <p className="text-green-500">Email Verified</p>
              ) : (
                <p className="text-red-500">Email Verified</p>
              )}
            </p>
          </div>
          <div>
            <Image
              src={`https://eu.ui-avatars.com/api/?name=${session.user.name}`}
              alt="alt"
              width={80}
              height={70}
              className="rounded-full shadow-lg"
            />
            {/* <pre>{JSON.stringify(userData, null, 2)}</pre> */}
          </div>
        </div>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded "
          onClick={() => signOut()}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
