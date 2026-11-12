"use client";
import { useState } from "react";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Mail, Loader2, CheckCircle2 } from "lucide-react";
import AuthLayoutShell from "@/components/auth/AuthLayoutShell";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      if (response.ok) {
        setSubmitted(true);
        toast.success("If that email is registered, a reset link is on its way.", {
          position: "top-right",
          autoClose: 4000,
        });
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to request password reset.", {
          position: "top-right",
          autoClose: 4000,
        });
      }
    } catch {
      toast.error("Something went wrong. Please try again.", {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <AuthLayoutShell
        badge="Account Recovery"
        title="Reset your password"
        subtitle="Enter your account email address and we will send you a secure password reset link."
      >
        {submitted ? (
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-6 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h2 className="font-semibold text-lg text-zinc-900 dark:text-white">Check your email</h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              If <strong className="text-zinc-900 dark:text-white">{email}</strong> is registered with TripMate, a reset link has been dispatched. Please check your spam folder if it doesn&apos;t arrive shortly.
            </p>
            <div className="pt-2">
              <Link
                href="/sign-in"
                className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 px-5 py-2.5 text-xs font-medium text-white dark:text-zinc-900 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Return to sign in
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 rounded-lg border-zinc-200 dark:border-zinc-800 focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="mt-4 w-full h-11 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 font-medium text-sm transition-all shadow-sm"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Send Password Reset Link"
              )}
            </Button>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-900 text-xs">
              <Link
                href="/sign-in"
                className="flex items-center gap-1.5 font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to sign in</span>
              </Link>
              <Link href="/sign-up" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                Create new account
              </Link>
            </div>
          </form>
        )}
      </AuthLayoutShell>
    </>
  );
};

export default ForgotPasswordPage;
