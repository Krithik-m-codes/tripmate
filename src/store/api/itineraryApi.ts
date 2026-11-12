import { baseApi } from "./baseApi";

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}

export interface ItineraryItem {
  _id: string;
  userId: string;
  organizationId?: string;
  destination: string;
  days: Record<string, unknown>;
  activities: string[];
  budget: string;
  travelStyle: string;
  itinerary: string;
  isPublic?: boolean;
  tags?: string[];
  rating?: number;
  notes?: string;
  createdAt: string;
}

export interface GetItinerariesParams {
  page?: number;
  limit?: number;
  search?: string;
  budget?: string;
  travelStyle?: string;
  organizationId?: string;
  userId?: string;
}

export const itineraryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getItineraries: builder.query<PaginatedResponse<ItineraryItem>, GetItinerariesParams | void>({
      query: (params) => ({
        url: "/itineraries",
        method: "GET",
        params: params || {},
      }),
      providesTags: (result) =>
        result && result.data
          ? [
              ...result.data.map(({ _id }) => ({ type: "Itinerary" as const, id: _id })),
              { type: "ItineraryList", id: "LIST" },
            ]
          : [{ type: "ItineraryList", id: "LIST" }],
    }),
    getItineraryById: builder.query<{ success: boolean; data: ItineraryItem }, string>({
      query: (id) => ({
        url: `/itineraries/${id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "Itinerary", id }],
    }),
    createItinerary: builder.mutation<{ success: boolean; data: ItineraryItem }, Partial<ItineraryItem>>({
      query: (body) => ({
        url: "/itineraries",
        method: "POST",
        data: body,
      }),
      invalidatesTags: [{ type: "ItineraryList", id: "LIST" }],
    }),
    updateItinerary: builder.mutation<
      { success: boolean; data: ItineraryItem },
      { id: string; body: Partial<ItineraryItem> }
    >({
      query: ({ id, body }) => ({
        url: `/itineraries/${id}`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Itinerary", id },
        { type: "ItineraryList", id: "LIST" },
      ],
    }),
    deleteItinerary: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/itineraries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "ItineraryList", id: "LIST" }],
    }),
  }),
});

export const {
  useGetItinerariesQuery,
  useGetItineraryByIdQuery,
  useCreateItineraryMutation,
  useUpdateItineraryMutation,
  useDeleteItineraryMutation,
} = itineraryApi;
