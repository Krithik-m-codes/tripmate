"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
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

      if (response.ok) {
        toast.success("Sign up successful!", {
          position: "top-right",
          autoClose: 3000,
        });

        const emailResponse = await sendVerificationEmail(
          email,
          fullName,
          data.verifyCode
        );

        if (emailResponse.success) {
          toast.info("Verification email sent. Please check your inbox.", {
            position: "top-right",
            autoClose: 5000,
          });
          router.push(`/verify-email/?username=${username}`);
        } else {
          toast.error("Failed to send verification email. Please try again.", {
            position: "top-right",
            autoClose: 5000,
          });
        }
      } else {
        toast.error(data.message || "Failed to sign up. Please try again.", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error("Sign up error:", error);
      toast.error("An unexpected error occurred. Please try again later.", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gray-100 bg-bg-sign-in bg-cover bg-center flex justify-center items-center text-black shadow relative">
        <div className="absolute inset-0 bg-black opacity-40"></div> {/* Overlay */}
        <motion.div
          className="flex flex-col-reverse gap-6 md:gap-0 md:flex-row justify-center items-center m-auto md:m-0 h-2/4 md:min-h-[70%] bg-gray-600 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-20 md:px-8 md:py-6 rounded-lg shadow-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          <div className="bg-transparent rounded p-6 max-w-md md:w-full">

            <form
              onSubmit={handleSignUp}
              className="border border-gray-300 p-5 md:p-10 rounded-lg bg-white shadow-lg"
            >
              <h1 className="text-2xl flex gap-2 justify-center items-center font-semibold text-gray-800 mb-5">
                Sign Up to{" "}
                <span className="text-[#006400]">TripMate</span>
                <Image
                  src="/tripmate-logo.png"
                  alt="TripMate logo"
                  width={60}
                  height={60}
                  className="rounded-full shadow-lg animate-bounce"
                />
              </h1>
              <div className="mb-5">
                <label className="block text-gray-800 font-semibold">Full Name</label>
                <input
                  type="text"
                  placeholder="Eg. Surya Alexander"
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>
              <div className="mb-5">
                <label className="block text-gray-800 font-semibold">Username</label>
                <input
                  type="text"
                  placeholder="Eg. SuryaAlexander234"
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
              <div className="mb-5">
                <label className="block text-gray-800 font-semibold">Email</label>
                <label className="block mt-1 text-xs text-red-600">
                  Please enter a valid email id, use the OTP to verify
                </label>
                <input
                  type="email"
                  placeholder="Eg. 0UqoK@example.com"
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-800 font-semibold">Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-900 text-white font-semibold rounded-lg transition duration-200 ease-in-out"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Go Back
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#006400] hover:bg-[#153831] text-white font-semibold rounded-lg transition duration-200 ease-in-out"
                  disabled={loading}
                >
                  {loading ? "Signing Up..." : "Sign Up"}
                </button>
              </div>
            </form>
          </div>
          <motion.div
            className="hidden md:block w-1/2 mx-6 transition duration-500 ease-in-out transform hover:scale-105 filter drop-shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            <Image
              src="/sign-up-illustration.svg"
              alt="Illustration"
              width={600}
              height={650}
              className="bg-transparent bg-center bg-cover rounded-lg"
            />
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default SignUpPage;
