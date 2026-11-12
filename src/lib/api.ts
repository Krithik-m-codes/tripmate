import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "/api",
  timeout: 30_000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request interceptor ─────────────────────────────────────────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Attach any additional headers here (e.g. CSRF tokens)
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor ────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (status === 401) {
      // Session expired — redirect to sign-in
      if (typeof window !== "undefined") {
        window.location.href = "/sign-in";
      }
    } else if (status === 429) {
      toast.error("Too many requests. Please wait a moment.", {
        toastId: "rate-limit",
      });
    } else if (status && status >= 500) {
      toast.error(message || "A server error occurred. Please try again.", {
        toastId: "server-error",
      });
    }

    return Promise.reject(error);
  }
);

export default api;
