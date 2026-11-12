"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, RefreshCw } from "lucide-react";
import AuthLayoutShell from "@/components/auth/AuthLayoutShell";

const OTP_LENGTH = 6;

const VerifyCodePage: React.FC = () => {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [username, setUsername] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUsername(params.get("username"));
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = [...digits];
    pasted.split("").forEach((ch, i) => {
      next[i] = ch;
    });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = digits.join("");
    if (otp.length < OTP_LENGTH) {
      toast.error("Please enter all 6 digits.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!username) {
      toast.error("Missing username. Please return to sign up.", {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/auth/verify-code/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, code: otp }),
      });
      if (response.ok) {
        toast.success("Email verified! Setting up your account…", {
          position: "top-right",
          autoClose: 2000,
        });
        setTimeout(
          () => router.push(`/set-password?username=${encodeURIComponent(username ?? "")}`),
          2000
        );
      } else {
        const data = await response.json();
        toast.error(data.message || "Invalid code. Please try again.", {
          position: "top-right",
          autoClose: 5000,
        });
        setDigits(Array(OTP_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
      }
    } catch {
      toast.error("Something went wrong. Please try again later.", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!username) {
      toast.error("Missing username. Please return to sign up.", {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }
    if (resendCooldown > 0) return;
    setResending(true);
    try {
      const response = await fetch("/api/auth/resend-verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Verification code resent.", {
          position: "top-right",
          autoClose: 3000,
        });
        setResendCooldown(60);
      } else {
        toast.error(data.message || "Failed to resend code.", {
          position: "top-right",
          autoClose: 4000,
        });
      }
    } catch {
      toast.error("Failed to resend code. Please try again.", {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <AuthLayoutShell
        badge="Email Verification"
        title="Verify your email"
        subtitle={`Enter the 6-digit verification code sent to your email for account (${username || "your account"}).`}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-3">
              6-Digit Verification Code
            </label>
            <div className="flex justify-between gap-2" onPaste={handlePaste}>
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="h-12 w-full max-w-[50px] rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-center font-mono text-xl font-bold text-zinc-900 dark:text-white transition-all outline-none focus:border-zinc-900 dark:focus:border-white focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white"
                  aria-label={`Digit ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-4 text-xs text-zinc-600 dark:text-zinc-400 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-medium text-zinc-900 dark:text-white">Didn&apos;t receive the code?</span>
              <button
                type="button"
                onClick={handleResend}
                disabled={resending || resendCooldown > 0}
                className="inline-flex items-center gap-1.5 font-semibold text-zinc-900 dark:text-white hover:underline disabled:opacity-50 transition-opacity"
              >
                <RefreshCw className={`h-3 w-3 ${resending ? "animate-spin" : ""}`} />
                <span>
                  {resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : resending
                      ? "Sending..."
                      : "Resend Code"}
                </span>
              </button>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Please check your spam or promotions folder if the email doesn&apos;t arrive right away. Codes expire after 1 hour.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full h-11 gap-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 font-medium transition-all shadow-sm text-sm"
            disabled={loading || digits.join("").length < OTP_LENGTH}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Complete Verification"
            )}
          </Button>
        </form>

        <div className="pt-6 border-t border-zinc-100 dark:border-zinc-900 text-center text-xs text-zinc-500 dark:text-zinc-400">
          Already verified?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-zinc-900 dark:text-white hover:underline transition-colors"
          >
            Sign in
          </Link>
        </div>
      </AuthLayoutShell>
    </>
  );
};

export default VerifyCodePage;
