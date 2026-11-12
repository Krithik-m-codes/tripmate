import { baseApi } from "./baseApi";

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  username?: string;
  avatar?: string;
  plan?: string;
  planStatus?: string;
  savedPlaces?: unknown[];
  preferences?: {
    defaultCurrency?: string;
    defaultTravelStyle?: string;
    language?: string;
    notifications?: boolean;
  };
  usage?: {
    periodStart: string;
    itineraryGenerations: number;
    geocodeRequests: number;
  };
  [key: string]: any;
}

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<{ success: boolean; data: UserProfile }, void>({
      query: () => ({
        url: "/users/profile",
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),
    updateProfile: builder.mutation<{ success: boolean; data: UserProfile }, Partial<UserProfile>>({
      query: (body) => ({
        url: "/users/profile",
        method: "PUT",
        data: body,
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = profileApi;
