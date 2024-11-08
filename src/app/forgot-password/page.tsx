"use client";
import React, { useState } from "react";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement password reset logic


    // Display success message
    alert("Password reset link sent to your email");
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-bg-sign-in
    backdrop-filter backdrop-blur-sm 
    bg-opacity-50 px-4 sm:px-6 lg:px-8 py-12 sm:py-24 lg:py-32
    "
    >
      <div className="max-w-md w-full px-6 py-8 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-semibold text-center">Forgot Password</h2>
        <form className="mt-8" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-emerald-500 sm:text-sm"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
