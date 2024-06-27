"use client";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// function to get the user profile
export default function ProfilePage() {
  const [response, setResponse] = useState(null);
  const { data: session } = useSession();
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
      <div className="text-3xl h-screen w-full flex flex-col gap-6 justify-center items-center absolute top-0 left-0 right-0 bottom-0 bg-black text-white">
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
    <div>
      <h1>
        Profile Page
        <button onClick={() => signOut()}>Sign Out</button>
      </h1>
      <pre>{JSON.stringify(response, null, 2)}</pre>
    </div>
  );
}
