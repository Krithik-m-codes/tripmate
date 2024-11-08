"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyCodePage: React.FC = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const username = new URLSearchParams(window.location.search).get(
      "username"
    );

    try {
      const response = await fetch("/api/verify-code/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, code: otp }),
      });

      if (response.ok) {
        toast.success("Email verified successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => router.push("/sign-in"), 3000);
      } else {
        toast.error("Invalid OTP. Please try again.", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error("Verification error:", error);
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
      <div className="flex justify-center items-center min-h-screen bg-bg-sign-in">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white bg-opacity-90 p-8 rounded-lg shadow-2xl w-full max-w-md"
        >
          <h2 className="text-3xl font-bold text-teal-700 mb-6 text-center">
            Verify Your Email
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Enter Email Verification Code
              </label>
              <input
                id="otp"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                type="submit"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify"}
              </motion.button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <a
              href="/sign-in"
              className="text-sm text-teal-600 hover:text-teal-800 transition-colors duration-300"
            >
              Already verified? Sign In
            </a>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default VerifyCodePage;
