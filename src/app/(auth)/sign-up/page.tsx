"use client";
// import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";
const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    avatar: "",
  });

  const router = useRouter();

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Handle form submission
    const { fullName, username, email, password } = formData;
    const avatar = `https://eu.ui-avatars.com/api/?name=${username}`;

    const response = await fetch("/api/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: fullName,
        username,
        email,
        password,
        avatar,
      }),
    });

    const data = await response.json();
    console.log("Data from server sign up : ", data);
    // Handle response
    if (response) {
      console.log("User signed up successfully");

      //send email verification
      const emailResponse = await sendVerificationEmail(
        email,
        fullName,
        data.verifyCode
      );

      // Handle email response
      if (!emailResponse.success) {
        console.log("Failed to send email");
      } else {
        console.log("Email sent successfully");

        // Redirect to verify email page
        router.push(`/verify-email/?username=${username}`);
      }
    } else {
      console.log("Failed to sign up");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 bg-bg-sign-up bg-cover bg-center flex justify-center items-center text-black shadow">
      <div className="bg-white shadow-md rounded p-10 max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-6">TripMate</h1>
        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label className="block text-gray-700">Full Name</label>
            <input
              type="text"
              placeholder="Eg. Surya Alexander"
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
              placeholder="Eg. SuryaAlexander234"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-black"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Eg. 0UqoK@example.com"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-black"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
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
          <div className="flex justify-between">
            <button
              type="button"
              className="px-6 py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700"
              onClick={() => router.back()}
            >
              Go Back
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
      {/* <div className="hidden md:block md:w-1/2 mx-10">
        <Image
          src="/your_image_url.png"
          alt="Illustration"
          width={500}
          height={500}
          className="rounded-lg shadow-lg"
        />
      </div> */}
    </div>
  );
};

export default SignUpPage;
