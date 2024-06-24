"use client";
import { useState } from "react";
// import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const VerifyCodePage: React.FC = () => {
  //   const { data: session } = useSession();
  const [otp, setOtp] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Get userId from the query params
    const username = new URLSearchParams(window.location.search).get(
      "username"
    );

    // Perform OTP verification logic here
    const response = await fetch("/api/verify-code/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, code: otp }),
    });

    // Handle response
    if (response.status === 200) {
      console.log("OTP verified successfully : ", response);
      // Redirect to login page
      router.push("/sign-in");
    } else {
      console.log("OTP verification failed : ", response);
      // Show error message
      alert("Invalid OTP. Please try again. otp received ");
      router.push("/sign-up");
    }
    // Redirect to login page
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#081b16]">
      <div className="flex justify-center items-center flex-col gap-5 w-[90%] h-[80%] bg-no-repeat md:rounded-lg bg-verify-code-bg-mobile bg-center bg-cover md:bg-verify-code-bg md:bg-center md:bg-cover shadow-inner">
        <h2 className="text-3xl font-bold text-white shadow-lg md:hidden">
          Verify Email with OTP
        </h2>
        <form
          className="bg-[#ffffffea] shadow-lg h-40% w-60%  md:h-[15rem] md:w-[28rem] rounded px-8 pt-6 pb-8 mb-4 "
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-lg font-bold mb-6"
              htmlFor="otp"
            >
              Enter Email Verification Code :
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="otp"
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between mt-8">
            <button
              className="bg-[#166f5b] hover:bg-[#153831] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Verify
            </button>
            <button>
              <a
                className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                href="/sign-in"
              >
                Sign In
              </a>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyCodePage;
