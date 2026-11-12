import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import axiosClient from "@/lib/axiosClient";
import { AxiosRequestConfig, AxiosError } from "axios";

export interface HybridAxiosBaseQueryArgs {
  url: string;
  method: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
  headers?: AxiosRequestConfig["headers"];
}

const hybridAxiosBaseQuery =
  (): BaseQueryFn<HybridAxiosBaseQueryArgs, unknown, unknown> =>
  async ({ url, method, data, params, headers }) => {
    try {
      const result = await axiosClient({
        url,
        method,
        data,
        params,
        headers,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError<{ message?: string; error?: string }>;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: hybridAxiosBaseQuery(),
  tagTypes: [
    "Itinerary",
    "ItineraryList",
    "SavedPlace",
    "SavedPlaceList",
    "Organization",
    "OrganizationList",
    "Profile",
  ],
  endpoints: () => ({}),
});
