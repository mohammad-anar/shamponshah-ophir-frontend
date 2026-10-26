/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStats: builder.query<any, void>({
      query: () => ({
        url: "/admin/stats",
        method: "GET",
      }),
      providesTags: ["admin", "orders", "vendors"],
    }),
    getVendorApprovals: builder.query<any, string | void>({
      query: (status) => ({
        url: "/admin/vendor-approvals",
        method: "GET",
        params: status ? { status } : undefined,
      }),
      providesTags: ["admin", "vendors"],
    }),
    updateVendorApproval: builder.mutation<any, { id: string; status: string; adminNote?: string }>({
      query: ({ id, ...body }) => ({
        url: `/admin/vendor-approvals/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["admin", "vendors"],
    }),
    getAllUsers: builder.query<any, { page?: number; limit?: number; search?: string } | void>({
      query: (params) => ({
        url: "/admin/users",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["admin"],
    }),
    getAllOrders: builder.query<any, { page?: number; limit?: number } | void>({
      query: (params) => ({
        url: "/admin/orders",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["admin", "orders"],
    }),
    getLevelRules: builder.query<any, void>({
      query: () => ({
        url: "/admin/levels/rules",
        method: "GET",
      }),
      providesTags: ["admin"],
    }),
    updateLevelRule: builder.mutation<any, any>({
      query: (body) => ({
        url: "/admin/levels/rules",
        method: "POST",
        body,
      }),
      invalidatesTags: ["admin"],
    }),
    getAllDisputes: builder.query<any, void>({
      query: () => ({
        url: "/admin/disputes",
        method: "GET",
      }),
      providesTags: ["admin"],
    }),
    resolveDispute: builder.mutation<any, { id: string; action: string; clientRefundDollar?: number; vendorPayoutDollar?: number; reasonNote?: string }>({
      query: ({ id, ...body }) => ({
        url: `/admin/disputes/${id}/resolve`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["admin"],
    }),
    getPayouts: builder.query<any, void>({
      query: () => ({
        url: "/admin/payouts",
        method: "GET",
      }),
      providesTags: ["admin"],
    }),
    getFeesReports: builder.query<any, void>({
      query: () => ({
        url: "/admin/fees-reports",
        method: "GET",
      }),
      providesTags: ["admin"],
    }),
    getReviewsReports: builder.query<any, void>({
      query: () => ({
        url: "/admin/reviews-reports",
        method: "GET",
      }),
      providesTags: ["admin", "reviews"],
    }),
    moderateReview: builder.mutation<any, { id: string; action: "publish" | "hide" | "delete" }>({
      query: ({ id, action }) => ({
        url: `/admin/reviews-reports/${id}/moderate`,
        method: "PATCH",
        body: { action },
      }),
      invalidatesTags: ["admin", "reviews"],
    }),
    getAllGigs: builder.query<any, { page?: number; limit?: number; search?: string; status?: string } | void>({
      query: (params) => ({
        url: "/admin/gigs",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["admin", "gigs"],
    }),
    getPendingGigs: builder.query<any, { page?: number; limit?: number; search?: string } | void>({
      query: (params) => ({
        url: "/admin/gigs/pending",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["admin", "gigs"],
    }),
    approveGig: builder.mutation<any, { id: string; adminNotes?: string }>({
      query: ({ id, ...body }) => ({
        url: `/admin/gigs/${id}/approve`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["admin", "gigs"],
    }),
    rejectGig: builder.mutation<any, { id: string; reason: string; adminNotes?: string }>({
      query: ({ id, ...body }) => ({
        url: `/admin/gigs/${id}/reject`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["admin", "gigs"],
    }),
    suspendGig: builder.mutation<any, { id: string; reason?: string }>({
      query: ({ id, ...body }) => ({
        url: `/admin/gigs/${id}/suspend`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["admin", "gigs"],
    }),
    updateGigStatus: builder.mutation<any, { id: string; status: string; reason?: string; adminNotes?: string }>({
      query: ({ id, ...body }) => ({
        url: `/admin/gigs/${id}/status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["admin", "gigs"],
    }),
    getAllReports: builder.query<any, { page?: number; limit?: number; search?: string; status?: string } | void>({
      query: (params) => ({
        url: "/admin/reports",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["admin", "gigs"],
    }),
    moderateReport: builder.mutation<any, { id: string; action: "SUSPEND_GIG" | "DISMISS" | "RESOLVE"; adminNotes?: string }>({
      query: ({ id, ...body }) => ({
        url: `/admin/reports/${id}/action`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["admin", "gigs"],
    }),
    getAllTransactions: builder.query<any, { page?: number; limit?: number; search?: string; status?: string; type?: string } | void>({
      query: (params) => ({
        url: "/admin/transactions",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["admin", "orders"],
    }),
    getAllWallets: builder.query<any, { page?: number; limit?: number; search?: string } | void>({
      query: (params) => ({
        url: "/admin/wallets",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["admin", "vendors"],
    }),
    getAllOffers: builder.query<any, { page?: number; limit?: number; search?: string; status?: string } | void>({
      query: (params) => ({
        url: "/admin/offers",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["admin", "jobs"],
    }),
    getAllJobs: builder.query<any, { page?: number; limit?: number } | void>({
      query: (params) => ({
        url: "/admin/jobs",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["admin", "jobs"],
    }),
    getAdminSettings: builder.query<any, void>({
      query: () => ({
        url: "/admin/settings",
        method: "GET",
      }),
      providesTags: ["admin"],
    }),
    updateAdminSettings: builder.mutation<any, any>({
      query: (body) => ({
        url: "/admin/settings",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["admin"],
    }),
    getAdminSupportTickets: builder.query<any, void>({
      query: () => ({
        url: "/admin/support/tickets",
        method: "GET",
      }),
      providesTags: ["admin"],
    }),
    replySupportTicket: builder.mutation<any, { id: string; text: string; sender?: string }>({
      query: ({ id, ...body }) => ({
        url: `/admin/support/tickets/${id}/reply`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["admin"],
    }),
    updateSupportTicketStatus: builder.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/admin/support/tickets/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["admin"],
    }),
    disbursePayout: builder.mutation<any, string>({
      query: (id) => ({
        url: `/admin/payouts/${id}/disburse`,
        method: "POST",
      }),
      invalidatesTags: ["admin"],
    }),
    recalculateLevels: builder.mutation<any, void>({
      query: () => ({
        url: "/admin/levels/recalculate",
        method: "POST",
      }),
      invalidatesTags: ["admin", "vendors"],
    }),
    updateUserStatus: builder.mutation<any, { id: string; role?: string; isEmailVerified?: boolean }>({
      query: ({ id, ...body }) => ({
        url: `/admin/users/${id}/status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["admin"],
    }),
    getAdminGigById: builder.query<any, string>({
      query: (id) => ({
        url: `/admin/gigs/${id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "gigs", id }],
    }),
    getAdminJobById: builder.query<any, string>({
      query: (id) => ({
        url: `/admin/jobs/${id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "jobs", id }],
    }),
    awardJobBid: builder.mutation<any, { jobId: string; offerId: string }>({
      query: ({ jobId, offerId }) => ({
        url: `/admin/jobs/${jobId}/offers/${offerId}/award`,
        method: "POST",
      }),
      invalidatesTags: ["admin", "jobs", "orders"],
    }),
  }),
});

export const {
  useGetAdminStatsQuery,
  useGetVendorApprovalsQuery,
  useUpdateVendorApprovalMutation,
  useGetAllUsersQuery,
  useGetAllOrdersQuery,
  useGetLevelRulesQuery,
  useUpdateLevelRuleMutation,
  useGetAllDisputesQuery,
  useResolveDisputeMutation,
  useGetPayoutsQuery,
  useGetFeesReportsQuery,
  useGetReviewsReportsQuery,
  useModerateReviewMutation,
  useGetAllGigsQuery,
  useGetPendingGigsQuery,
  useApproveGigMutation,
  useRejectGigMutation,
  useSuspendGigMutation,
  useUpdateGigStatusMutation,
  useGetAllReportsQuery,
  useModerateReportMutation,
  useGetAllTransactionsQuery,
  useGetAllWalletsQuery,
  useGetAllOffersQuery,
  useGetAllJobsQuery,
  useGetAdminSettingsQuery,
  useUpdateAdminSettingsMutation,
  useGetAdminSupportTicketsQuery,
  useReplySupportTicketMutation,
  useUpdateSupportTicketStatusMutation,
  useDisbursePayoutMutation,
  useRecalculateLevelsMutation,
  useUpdateUserStatusMutation,
  useGetAdminGigByIdQuery,
  useGetAdminJobByIdQuery,
  useAwardJobBidMutation,
} = adminApi;


