"use client";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch("/api/profile");
      console.log("Response : ", response);
      const data = await response.json();

      if (data.success) {
        setUser(data.data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!user) return <p>User not found</p>;

  return (
    <div>
      <h1>Profile</h1>
      <p>{user}</p>
    </div>
  );
};

export default ProfilePage;
