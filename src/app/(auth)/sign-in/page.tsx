"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // handle form submission
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (response && !response.error) {
        toast.success("Sign in successful!", {
          position: "top-right",
          autoClose: 3000,
        });
        router.push("/map");
      } else {
        toast.error("Sign in failed. Please check your credentials.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex items-center justify-center min-h-screen bg-green-200 bg-bg-sign-in bg-cover bg-no-repeat bg-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-around bg-white text-black rounded-xl w-11/12 md:w-4/5 lg:w-2/3 xl:w-1/2 p-6 md:p-8 backdrop-blur-md shadow-lg"
        >
          {/* Image */}
          <div className="w-full md:w-1/2 h-48 md:h-full">
            <Image
              src="/assets/sign-in-image.png"
              alt="Sign in image"
              width={500}
              height={500}
              className="object-cover object-center w-full h-full rounded-lg shadow-sm"
            />
          </div>

          {/* Form */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col gap-6 text-left w-full md:w-1/2 items-center justify-center p-6"
          >
            {/* Logo */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex items-center gap-3 mb-4"
            >
              <Image
                src="/tripmate-logo.png"
                alt="Tripmate logo"
                width={60}
                height={60}
                className="rounded-full"
              />
              <h1 className="text-3xl font-bold text-center text-gray-800">
                TripMate
              </h1>
            </motion.div>
            <form onSubmit={handleFormSubmit} className="w-full space-y-4">
              <div>
                <label htmlFor="email" className="block text-gray-700 font-semibold">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-3 border rounded-lg text-gray-800 shadow-sm focus:outline-none focus:border-primary"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData({ ...formData, email: event.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-gray-700 font-semibold">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full p-3 border rounded-lg text-gray-800 shadow-sm focus:outline-none focus:border-primary"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(event) =>
                    setFormData({ ...formData, password: event.target.value })
                  }
                />
              </div>
              <div className="flex flex-col items-center gap-4">
                <a href="/forgot-password" className="text-primary-500 hover:underline">
                  Forgot password?
                </a>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full bg-primary-500 px-6 py-2 rounded-lg bg-orange-400 text-white font-semibold shadow-md hover:bg-primary-600 transition-colors duration-300"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </motion.button>
              </div>
            </form>

            <div className="flex items-center justify-center gap-2">
              <p>Don&apos;t have an account?</p>
              <a href="/sign-up" className="text-primary-500 hover:underline">
                Sign up
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
