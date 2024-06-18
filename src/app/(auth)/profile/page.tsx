"use client";
import { signOut } from "next-auth/react";
import React from "react";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [response, setResponse] = useState(null);
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
