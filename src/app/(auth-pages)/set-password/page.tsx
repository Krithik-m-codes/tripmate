"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import AuthLayoutShell from "@/components/auth/AuthLayoutShell";

export default function SetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setUsername(new URLSearchParams(window.location.search).get("username"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords don't match.", { position: "top-right", autoClose: 3000 });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Password set! Sign in to continue.", {
          position: "top-right",
          autoClose: 2500,
        });
        setTimeout(() => router.push("/sign-in"), 2500);
      } else {
        toast.error(data.message || "Failed to set password.", {
          position: "top-right",
          autoClose: 4000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <AuthLayoutShell
        badge="Optional Security"
        title="Set your password"
        subtitle="Create a password so you can sign in quickly using either email/password or email OTP."
      >
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-3.5 flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-zinc-500 dark:text-zinc-400" />
          <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Your email has been verified. You can set a password right now or skip this step and use one-time code login anytime.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Account Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-11 rounded-lg border-zinc-200 dark:border-zinc-800 focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white"
                minLength={6}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                type="password"
                placeholder="Repeat your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="pl-10 h-11 rounded-lg border-zinc-200 dark:border-zinc-800 focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-11 rounded-lg border-zinc-200 dark:border-zinc-800 font-medium text-xs"
              onClick={() => router.push("/sign-in")}
              disabled={loading}
            >
              Skip for now
            </Button>
            <Button
              type="submit"
              className="flex-1 h-11 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 font-medium text-xs transition-all shadow-sm"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Set Password"
              )}
            </Button>
          </div>
        </form>
      </AuthLayoutShell>
    </>
  );
}
