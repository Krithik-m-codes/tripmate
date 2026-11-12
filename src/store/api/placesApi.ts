import { baseApi } from "./baseApi";
import { PaginatedResponse } from "./itineraryApi";

export interface SavedPlaceItem {
  _id: string;
  userId: string;
  organizationId?: string;
  name: string;
  location: string;
  description: string;
  category?: "restaurant" | "attraction" | "hotel" | "hidden_gem" | "general";
  rating?: number;
  notes?: string;
  coordinates?: { lat: number; lng: number };
  createdAt: string;
}

export interface GetPlacesParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  organizationId?: string;
}

export const placesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSavedPlaces: builder.query<PaginatedResponse<SavedPlaceItem>, GetPlacesParams | void>({
      query: (params) => ({
        url: "/saved-places",
        method: "GET",
        params: params || {},
      }),
      providesTags: (result) =>
        result && result.data
          ? [
              ...result.data.map(({ _id }) => ({ type: "SavedPlace" as const, id: _id })),
              { type: "SavedPlaceList", id: "LIST" },
            ]
          : [{ type: "SavedPlaceList", id: "LIST" }],
    }),
    createSavedPlace: builder.mutation<{ success: boolean; data: SavedPlaceItem }, Partial<SavedPlaceItem>>({
      query: (body) => ({
        url: "/saved-places",
        method: "POST",
        data: body,
      }),
      invalidatesTags: [{ type: "SavedPlaceList", id: "LIST" }],
    }),
    updateSavedPlace: builder.mutation<
      { success: boolean; data: SavedPlaceItem },
      { id: string; body: Partial<SavedPlaceItem> }
    >({
      query: ({ id, body }) => ({
        url: `/saved-places/${id}`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "SavedPlace", id },
        { type: "SavedPlaceList", id: "LIST" },
      ],
    }),
    deleteSavedPlace: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/saved-places/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "SavedPlaceList", id: "LIST" }],
    }),
  }),
});

export const {
  useGetSavedPlacesQuery,
  useCreateSavedPlaceMutation,
  useUpdateSavedPlaceMutation,
  useDeleteSavedPlaceMutation,
} = placesApi;
