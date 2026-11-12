"use client";
import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import AuthLayoutShell from "@/components/auth/AuthLayoutShell";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = useMemo(() => params.get("token"), [params]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Reset token is missing.", { position: "top-right", autoClose: 4000 });
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.", {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.", { position: "top-right", autoClose: 4000 });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Password updated. Redirecting to sign in…", {
          position: "top-right",
          autoClose: 2500,
        });
        setTimeout(() => router.push("/sign-in"), 2500);
      } else {
        toast.error(data.message || "Failed to reset password.", {
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
        badge="Secure Reset"
        title="Set a new password"
        subtitle="Choose a strong, unique password to secure your TripMate account."
      >
        {!token ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-50 dark:bg-red-950/30 p-5 text-sm text-red-600 dark:text-red-400 font-medium">
            ⚠️ This password reset token is invalid or has expired. Please return to the forgot password page and request a new one.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-950/30 p-3.5">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
                Your reset token is verified. Enter and confirm your new password below.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                New password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                <Input
                  type="password"
                  placeholder="Enter a new password (min. 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Confirm new password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                <Input
                  type="password"
                  placeholder="Re-enter your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 h-12 rounded-xl"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="mt-4 w-full h-12 gap-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white font-heading font-bold shadow-lg shadow-emerald-500/20 transition-all hover:opacity-95 active:scale-[0.99] text-sm"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Update Password & Sign In"}
            </Button>
          </form>
        )}
      </AuthLayoutShell>
    </>
  );
}
