/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

export const familyHubApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWorkspace: builder.query<any, void>({
      query: () => ({
        url: "/family-hub",
        method: "GET",
      }),
      providesTags: ["family-hub"],
    }),
    createBoard: builder.mutation<any, { title: string; eventDate?: string; notes?: string }>({
      query: (body) => ({
        url: "/family-hub/boards",
        method: "POST",
        body,
      }),
      invalidatesTags: ["family-hub"],
    }),
    addBoardItem: builder.mutation<any, { boardId?: string; data: any }>({
      query: ({ boardId, data }) => ({
        url: boardId && boardId !== "primary" ? `/family-hub/boards/${boardId}/items` : `/family-hub/items`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["family-hub"],
    }),
    voteBoardItem: builder.mutation<any, { itemId: string; vote: "YES" | "NO" | "MAYBE" }>({
      query: ({ itemId, vote }) => ({
        url: `/family-hub/items/${itemId}/vote`,
        method: "POST",
        body: { vote },
      }),
      invalidatesTags: ["family-hub"],
    }),
    deleteBoardItem: builder.mutation<any, string>({
      query: (itemId) => ({
        url: `/family-hub/items/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["family-hub"],
    }),
    updateBoardItem: builder.mutation<any, { itemId: string; data: any }>({
      query: ({ itemId, data }) => ({
        url: `/family-hub/items/${itemId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["family-hub"],
    }),
    inviteMember: builder.mutation<any, { email: string; role?: string }>({
      query: (body) => ({
        url: "/family-hub/invite",
        method: "POST",
        body,
      }),
      invalidatesTags: ["family-hub"],
    }),
    removeMember: builder.mutation<any, string>({
      query: (id) => ({ url: `/family-hub/members/${id}`, method: "DELETE" }),
      invalidatesTags: ["family-hub"],
    }),
    bookBoardItem: builder.mutation<any, { itemId: string; data?: { payerName?: string; note?: string; paymentMethod?: string } }>({
      query: ({ itemId, data }) => ({
        url: `/family-hub/items/${itemId}/book`,
        method: "POST",
        body: data || {},
      }),
      invalidatesTags: ["family-hub", "orders", "payments"],
    }),
  }),
});

export const {
  useGetWorkspaceQuery,
  useCreateBoardMutation,
  useAddBoardItemMutation,
  useVoteBoardItemMutation,
  useDeleteBoardItemMutation,
  useUpdateBoardItemMutation,
  useInviteMemberMutation,
  useRemoveMemberMutation,
  useBookBoardItemMutation,
} = familyHubApi;

export const useGetWorkspacesQuery = useGetWorkspaceQuery;
export const useVoteItemMutation = useVoteBoardItemMutation;
