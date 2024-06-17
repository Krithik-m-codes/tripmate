"use client";

import { useEffect } from "react";

export default function ProfilePage() {
  useEffect(() => {
    const getProfile = async () => {
      const response = await fetch("/api/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response : ", response);
    };

    getProfile();
  }, []);
  return (
    <div>
      <h1>
        
      </h1>
    </div>
  );
}
