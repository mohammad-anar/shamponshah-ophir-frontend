/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

export const jobsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClientJobs: builder.query<any, { status?: string } | void>({
      query: (params) => ({
        url: "/user/jobs",
        method: "GET",
        params: params?.status ? { status: params.status } : undefined,
      }),
      providesTags: ["jobs"],
    }),
    getClientJobById: builder.query<any, string>({
      query: (id) => ({
        url: `/user/jobs/${id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "jobs", id }],
    }),
    getJobOffers: builder.query<any, string>({
      query: (jobId) => ({
        url: `/user/jobs/${jobId}/offers`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "offers", id }],
    }),
    createJob: builder.mutation<any, any>({
      query: (body) => ({
        url: "/user/jobs",
        method: "POST",
        body,
      }),
      invalidatesTags: ["jobs"],
    }),
    publishJob: builder.mutation<any, string>({
      query: (id) => ({
        url: `/user/jobs/${id}/publish`,
        method: "POST",
      }),
      invalidatesTags: ["jobs"],
    }),
    getVendorFindJobs: builder.query<any, {
      category?: string;
      city?: string;
      search?: string;
      minBudget?: number;
      maxBudget?: number;
      page?: number;
      limit?: number;
      excludeOffered?: boolean;
    } | void>({
      query: (params) => ({
        url: "/vendor/find-jobs",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["jobs"],
    }),
    submitOffer: builder.mutation<any, { jobId: string; data: any }>({
      query: ({ jobId, data }) => ({
        url: `/vendor/jobs/${jobId}/offer`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["jobs", "offers", "vendors"],
    }),
    getVendorOffers: builder.query<any, void>({
      query: () => ({
        url: "/vendor/offers",
        method: "GET",
      }),
      providesTags: ["offers"],
    }),
    withdrawOffer: builder.mutation<any, string>({
      query: (offerId) => ({
        url: `/vendor/offers/${offerId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["offers", "vendors"],
    }),
    acceptOffer: builder.mutation<any, { jobId: string; offerId: string }>({
      query: ({ jobId, offerId }) => ({
        url: `/user/jobs/${jobId}/offers/${offerId}/accept`,
        method: "POST",
      }),
      invalidatesTags: ["jobs", "offers", "orders", "events"],
    }),
    updateJob: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/user/jobs/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["jobs", "events"],
    }),
    deleteJob: builder.mutation<any, string>({
      query: (id) => ({
        url: `/user/jobs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["jobs", "events"],
    }),
    cancelJob: builder.mutation<any, string>({
      query: (id) => ({
        url: `/user/jobs/${id}/cancel`,
        method: "POST",
      }),
      invalidatesTags: ["jobs", "events"],
    }),
  }),
});

export const {
  useGetClientJobsQuery,
  useGetClientJobByIdQuery,
  useGetJobOffersQuery,
  useCreateJobMutation,
  usePublishJobMutation,
  useGetVendorFindJobsQuery,
  useSubmitOfferMutation,
  useGetVendorOffersQuery,
  useWithdrawOfferMutation,
  useAcceptOfferMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useCancelJobMutation,
} = jobsApi;
