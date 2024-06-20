"use client";
import Image from "next/image";
import { useState } from "react";
const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    password: "",
    avatar: "",
  });

  const handleSignUp = () => {
    console.log(formData);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 text-black">
      <div className="bg-white shadow-md rounded p-10 max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-6">TripMate</h1>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700">Full Name</label>
            <input
              type="text"
              placeholder="Eg. Surya Jaysingh Yadav"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-black"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              placeholder="Eg. Suryakumar234"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-black"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-black"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <div className="flex justify-center mb-6">
            <div className="relative w-40 h-40 overflow-hidden bg-gray-100 rounded-full">
              <input
                type="text"
                className="absolute opacity-0 inset-0 w-full h-full cursor-pointer"
                value={formData.avatar}
                onChange={(e) =>
                  setFormData({ ...formData, avatar: e.target.value })
                }
              />
              <Image
                src="/placeholder_avatar_url.png"
                width={200}
                height={200}
                alt="Avatar"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <label className="absolute right-0 bottom-0 bg-gray-300 px-4 py-2 rounded-lg cursor-pointer">
                Upload here
              </label>
            </div>
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              className="px-6 py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700"
              onClick={() => window.history.back()}
            >
              Go Back
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700"
              onClick={() => handleSignUp()}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
      <div className="hidden md:block md:w-1/2 mx-10">
        <Image
          src="/your_image_url.png"
          alt="Illustration"
          width={500}
          height={500}
          className="rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default SignUpPage;
