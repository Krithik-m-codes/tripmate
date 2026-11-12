import { baseApi } from "./baseApi";

export interface OrganizationMember {
  userId: string;
  role: "owner" | "editor" | "viewer";
  joinedAt: string;
}

export interface OrganizationItem {
  _id: string;
  name: string;
  slug: string;
  ownerId: string;
  members: OrganizationMember[];
  sharedItineraries: string[];
  sharedPlaces: string[];
  createdAt: string;
}

export const organizationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrganizations: builder.query<{ success: boolean; data: OrganizationItem[] }, void>({
      query: () => ({
        url: "/organizations",
        method: "GET",
      }),
      providesTags: (result) =>
        result && result.data
          ? [
              ...result.data.map(({ _id }) => ({ type: "Organization" as const, id: _id })),
              { type: "OrganizationList", id: "LIST" },
            ]
          : [{ type: "OrganizationList", id: "LIST" }],
    }),
    getOrganizationById: builder.query<{ success: boolean; data: OrganizationItem }, string>({
      query: (id) => ({
        url: `/organizations/${id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "Organization", id }],
    }),
    createOrganization: builder.mutation<{ success: boolean; data: OrganizationItem }, { name: string }>({
      query: (body) => ({
        url: "/organizations",
        method: "POST",
        data: body,
      }),
      invalidatesTags: [{ type: "OrganizationList", id: "LIST" }],
    }),
    updateOrganization: builder.mutation<
      { success: boolean; data: OrganizationItem },
      { id: string; body: Partial<OrganizationItem> }
    >({
      query: ({ id, body }) => ({
        url: `/organizations/${id}`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Organization", id },
        { type: "OrganizationList", id: "LIST" },
      ],
    }),
    inviteMember: builder.mutation<
      { success: boolean; message: string; data: OrganizationItem },
      { id: string; email: string; role: "editor" | "viewer" }
    >({
      query: ({ id, email, role }) => ({
        url: `/organizations/${id}/invite`,
        method: "POST",
        data: { email, role },
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: "Organization", id }],
    }),
    removeMember: builder.mutation<{ success: boolean; message: string }, { id: string; userId: string }>({
      query: ({ id, userId }) => ({
        url: `/organizations/${id}/member/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: "Organization", id }],
    }),
    deleteOrganization: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/organizations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "OrganizationList", id: "LIST" }],
    }),
  }),
});

export const {
  useGetOrganizationsQuery,
  useGetOrganizationByIdQuery,
  useCreateOrganizationMutation,
  useUpdateOrganizationMutation,
  useInviteMemberMutation,
  useRemoveMemberMutation,
  useDeleteOrganizationMutation,
} = organizationApi;
