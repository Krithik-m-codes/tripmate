"use client";
import { useState } from "react";
import Link from "next/link";
import { signIn, client } from "@/lib/authClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Loader2, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";
import AuthLayoutShell from "@/components/auth/AuthLayoutShell";

type AuthMode = "password" | "otp";
type OtpStep = "email" | "code";

export default function SignInPage() {
  const [mode, setMode] = useState<AuthMode>("password");
  const [otpStep, setOtpStep] = useState<OtpStep>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result && !result.error) {
        toast.success("Welcome back!", { position: "top-right", autoClose: 2000 });
        router.push("/dashboard");
      } else {
        const errorCode = result?.error?.code || result?.error;
        const messageMap: Record<string, string> = {
          EmailNotVerified: "Please verify your email before signing in.",
          InvalidPassword: "Invalid password. Please try again.",
          LoginFailed: "Sign in failed. Please try again.",
          CredentialsSignin: "Sign in failed. Check your credentials.",
          NoPasswordSet:
            "No password is set for this account. Use the Email OTP tab to sign in, or set a password from your profile.",
        };
        toast.error(messageMap[errorCode || ""] || "Invalid email or password.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await client.emailOtp.sendVerificationOtp({
        email: otpEmail.trim().toLowerCase(),
        type: "sign-in",
      });
      if (!res.error) {
        toast.success("Security code sent! Please check your email.", { position: "top-right", autoClose: 3000 });
        if (process.env.NODE_ENV === "development") {
          toast.info("🛠️ [DEV MODE] Check terminal console running npm run dev for your 6-digit code!", { position: "top-right", autoClose: 10000 });
        }
        setOtpStep("code");
      } else {
        toast.error(res.error?.message || "Failed to send OTP.", {
          position: "top-right",
          autoClose: 4000,
        });
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong.", { position: "top-right", autoClose: 4000 });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn("email-otp", {
        redirect: false,
        email: otpEmail.trim().toLowerCase(),
        otp: otp.trim(),
      });
      if (result && !result.error) {
        toast.success("Welcome back!", { position: "top-right", autoClose: 2000 });
        router.push("/dashboard");
      } else {
        const errorCode = result?.error?.code || result?.error?.message || result?.error;
        const messageMap: Record<string, string> = {
          OtpInvalid: "Invalid security code. Please check and try again.",
          OtpExpired: "Security code has expired. Request a new one.",
          INVALID_OTP: "Invalid security code. Please try again.",
          OTP_EXPIRED: "Security code has expired. Request a new one.",
        };
        toast.error(messageMap[errorCode || ""] || (typeof errorCode === "string" ? errorCode : "Invalid or expired code. Please try again."), {
          position: "top-right",
          autoClose: 4000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const res = await client.emailOtp.sendVerificationOtp({
        email: otpEmail.trim().toLowerCase(),
        type: "sign-in",
      });
      if (!res.error) {
        toast.success("New security code sent!", { position: "top-right", autoClose: 3000 });
        if (process.env.NODE_ENV === "development") {
          toast.info("🛠️ [DEV MODE] Check terminal console running npm run dev for your 6-digit code!", { position: "top-right", autoClose: 10000 });
        }
        setOtp("");
      } else {
        toast.error(res.error?.message || "Failed to resend code.", {
          position: "top-right",
          autoClose: 4000,
        });
      }
    } catch (err: any) {
      toast.error(err?.message || "Could not resend code.", { position: "top-right", autoClose: 4000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <AuthLayoutShell
        badge="Account Access"
        title="Welcome back"
        subtitle="Sign in to view your itineraries and saved travel collections."
      >
        {/* Subtle Mode Switcher Tabs */}
        <div className="flex rounded-lg bg-zinc-100 dark:bg-zinc-900/90 p-1 border border-zinc-200/60 dark:border-zinc-800">
          {(["password", "otp"] as AuthMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setOtpStep("email");
                setOtp("");
              }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 rounded-md py-2 text-xs font-medium tracking-wide transition-all duration-200",
                mode === m
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm font-semibold"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              )}
            >
              {m === "password" ? (
                <>
                  <KeyRound className="h-3.5 w-3.5" />
                  <span>Password</span>
                </>
              ) : (
                <>
                  <Mail className="h-3.5 w-3.5" />
                  <span>One-Time Code</span>
                </>
              )}
            </button>
          ))}
        </div>

        {/* Password Form */}
        {mode === "password" && (
          <form onSubmit={handlePasswordSignIn} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 rounded-lg border-zinc-200 dark:border-zinc-800 focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 rounded-lg border-zinc-200 dark:border-zinc-800 focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="mt-4 w-full h-11 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 font-medium text-sm transition-all shadow-sm"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Continue with Password"
              )}
            </Button>
          </form>
        )}

        {/* Email OTP Step 1 Form */}
        {mode === "otp" && otpStep === "email" && (
          <form onSubmit={handleSendOtp} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={otpEmail}
                  onChange={(e) => setOtpEmail(e.target.value)}
                  className="pl-10 h-11 rounded-lg border-zinc-200 dark:border-zinc-800 focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white"
                  required
                />
              </div>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              We&apos;ll send a 6-digit verification code to sign you securely into your account without a password.
            </p>

            <Button
              type="submit"
              className="mt-4 w-full h-11 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 font-medium text-sm transition-all shadow-sm"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Send One-Time Code"
              )}
            </Button>
          </form>
        )}

        {/* Email OTP Step 2 Form */}
        {mode === "otp" && otpStep === "code" && (
          <form onSubmit={handleOtpSignIn} className="space-y-4 pt-2">
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-3.5">
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Code sent to <span className="font-semibold text-zinc-900 dark:text-white">{otpEmail}</span>. Enter the 6 digits below.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                6-Digit Security Code
              </label>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="• • • • • •"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="h-12 text-center font-mono text-xl font-bold tracking-[0.4em] rounded-lg border-zinc-200 dark:border-zinc-800 focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white"
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-11 rounded-lg border-zinc-200 dark:border-zinc-800 font-medium text-xs"
                onClick={() => {
                  setOtpStep("email");
                  setOtp("");
                }}
                disabled={loading}
              >
                Change Email
              </Button>
              <Button
                type="submit"
                className="flex-1 h-11 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 font-medium text-xs transition-all shadow-sm"
                disabled={loading || otp.length < 6}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Sign In"}
              </Button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                disabled={loading}
              >
                Didn&apos;t receive the code? Resend
              </button>
            </div>
          </form>
        )}

        <div className="pt-6 border-t border-zinc-100 dark:border-zinc-900 text-center text-xs text-zinc-500 dark:text-zinc-400">
          New to TripMate?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-zinc-900 dark:text-white hover:underline transition-colors"
          >
            Create an account
          </Link>
        </div>
      </AuthLayoutShell>
    </>
  );
}
