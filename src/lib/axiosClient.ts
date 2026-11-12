import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";

export const axiosClient = axios.create({
  baseURL: "/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred.";

    // We can surface critical API failures to console or toast when appropriate
    if (error.response?.status !== 401 && typeof window !== "undefined") {
      console.error("[API Error]:", errorMessage);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
