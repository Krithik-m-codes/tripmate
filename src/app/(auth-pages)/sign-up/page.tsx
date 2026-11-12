"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Mail, AtSign, Loader2 } from "lucide-react";
import AuthLayoutShell from "@/components/auth/AuthLayoutShell";

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { fullName, username, email } = formData;
      const avatar = `https://eu.ui-avatars.com/api/?name=${encodeURIComponent(username)}`;
      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fullName, username: username.trim(), email: email.trim().toLowerCase(), avatar }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Account created! Check your inbox for a verification code.", {
          position: "top-right",
          autoClose: 4000,
        });
        router.push(`/verify-email/?username=${username.trim()}`);
      } else {
        toast.error(data.message || "Failed to sign up. Please try again.", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.", {
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
      <AuthLayoutShell
        badge="New Account"
        title="Start your journey"
        subtitle="Create an account to save favorite destinations and plan trips effortlessly."
      >
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="fullName" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                id="fullName"
                type="text"
                placeholder="Alex Parker"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="pl-10 h-11 rounded-lg border-zinc-200 dark:border-zinc-800 focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="username" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Username
            </label>
            <div className="relative">
              <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                id="username"
                type="text"
                placeholder="alexparker"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="pl-10 h-11 rounded-lg border-zinc-200 dark:border-zinc-800 focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-10 h-11 rounded-lg border-zinc-200 dark:border-zinc-800 focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white"
                required
              />
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed pt-1">
              We&apos;ll send a 6-digit verification code to confirm your email.
            </p>
          </div>

          <Button
            type="submit"
            className="mt-4 w-full h-11 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 font-medium text-sm transition-all shadow-sm"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Create Account"
            )}
          </Button>

          <div className="pt-6 border-t border-zinc-100 dark:border-zinc-900 text-center text-xs text-zinc-500 dark:text-zinc-400">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-semibold text-zinc-900 dark:text-white hover:underline transition-colors"
            >
              Sign in
            </Link>
          </div>
        </form>
      </AuthLayoutShell>
    </>
  );
};

export default SignUpPage;
