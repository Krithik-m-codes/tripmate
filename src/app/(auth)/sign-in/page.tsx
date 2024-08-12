"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
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
      <div className="flex items-center justify-around md:justify-center min-h-screen bg-bg-sign-in bg-cover bg-no-repeat bg-center bg-opacity-70 backdrop-blur-sm ">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-around md:justify-center bg-white text-black rounded-lg w-11/12 md:w-5/6 lg:w-2/3 h-auto lg:h-5/6 overflow-hidden shadow-xl"
        >
          <div className="w-full md:w-1/2 h-48 md:h-full">
            <Image
              src="/assets/sign-in-image.jpg"
              alt="Sign in image"
              width={500}
              height={500}
              className="object-cover object-center w-full h-full"
            />
          </div>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col gap-4 md:gap-6 lg:gap-8 text-left w-full md:w-1/2 h-full md:max-h-full items-center justify-center p-6 md:p-8 bg-gray-600 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex justify-center items-center gap-2"
            >
              <Image
                src="/tripmate-logo.png"
                alt="Tripmate logo"
                width={60}
                height={60}
                className="rounded-full"
              />
              <h1 className="text-3xl md:text-4xl font-bold text-center">
                TripMate
              </h1>
            </motion.div>
            <form
              onSubmit={handleFormSubmit}
              className="flex flex-col justify-center items-center w-full space-y-4"
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="w-full"
              >
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData({ ...formData, email: event.target.value })
                  }
                />
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="w-full"
              >
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(event) =>
                    setFormData({ ...formData, password: event.target.value })
                  }
                />
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="flex flex-col items-center gap-4 w-full"
              >
                <a
                  href="/forgot-password"
                  className="text-primary-400 hover:underline"
                >
                  Forgot password?
                </a>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="bg-orange-400 px-6 py-2 rounded-full text-white font-semibold shadow-md hover:bg-orange-500 transition-colors duration-300"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </motion.button>
              </motion.div>
            </form>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="flex justify-center items-center gap-2"
            >
              <p>Don&apos;t have an account?</p>
              <a href="/sign-up" className="text-primary-400 hover:underline">
                Sign up
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
