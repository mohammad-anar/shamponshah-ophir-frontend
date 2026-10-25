/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

export const reviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClientReviews: builder.query<any, void>({
      query: () => ({
        url: "/reviews/client",
        method: "GET",
      }),
      providesTags: ["reviews"],
    }),
    getVendorReviews: builder.query<any, { vendorId: string; page?: number; limit?: number }>({
      query: ({ vendorId, ...params }) => ({
        url: `/reviews/vendor/${vendorId}`,
        method: "GET",
        params,
      }),
      providesTags: ["reviews"],
    }),
    getGigReviews: builder.query<any, { gigId: string; page?: number; limit?: number }>({
      query: ({ gigId, ...params }) => ({
        url: `/reviews/gig/${gigId}`,
        method: "GET",
        params,
      }),
      providesTags: ["reviews"],
    }),
    replyToReview: builder.mutation<any, { reviewId: string; reply: string }>({
      query: ({ reviewId, reply }) => ({
        url: `/reviews/${reviewId}/reply`,
        method: "PATCH",
        body: { reply },
      }),
      invalidatesTags: ["reviews", "vendors"],
    }),
  }),
});

export const {
  useGetClientReviewsQuery,
  useGetVendorReviewsQuery,
  useGetGigReviewsQuery,
  useReplyToReviewMutation,
} = reviewsApi;

