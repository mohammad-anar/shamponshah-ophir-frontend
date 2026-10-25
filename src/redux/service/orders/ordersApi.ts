/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<any, any>({
      query: (body) => ({
        url: "/orders",
        method: "POST",
        body,
      }),
      invalidatesTags: ["orders", "payments"],
    }),
    getClientOrders: builder.query<any, { status?: string; page?: number; limit?: number } | void>({
      query: (params) => ({
        url: "/orders/client",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["orders"],
    }),
    getVendorOrders: builder.query<any, { status?: string; page?: number; limit?: number } | void>({
      query: (params) => ({
        url: "/orders/vendor",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["orders"],
    }),
    getOrderById: builder.query<any, string>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "orders", id }],
    }),
    approveMilestone: builder.mutation<any, { orderId: string; milestoneId: string; note?: string }>({
      query: ({ orderId, milestoneId, note }) => ({
        url: `/orders/${orderId}/milestones/${milestoneId}/approve`,
        method: "POST",
        body: { note },
      }),
      invalidatesTags: ["orders", "payments"],
    }),
    submitMilestoneDelivery: builder.mutation<any, { orderId: string; milestoneId: string; notes?: string; proofUrl?: string }>({
      query: ({ orderId, milestoneId, ...body }) => ({
        url: `/orders/${orderId}/milestones/${milestoneId}/submit`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["orders"],
    }),
    deliverOrder: builder.mutation<any, { orderId: string; notes?: string; proofUrl?: string }>({
      query: ({ orderId, ...body }) => ({
        url: `/orders/${orderId}/deliver`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["orders"],
    }),
    getPaymentLedger: builder.query<any, void>({
      query: () => ({
        url: "/orders/payments/ledger",
        method: "GET",
      }),
      providesTags: ["orders", "payments"],
    }),
    createReview: builder.mutation<any, { orderId: string; rating: number; title?: string; comment: string }>({
      query: ({ orderId, ...body }) => ({
        url: `/orders/${orderId}/review`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["orders", "reviews", "vendors"],
    }),
    getClientDisputes: builder.query<any, void>({
      query: () => ({
        url: "/orders/disputes/client",
        method: "GET",
      }),
      providesTags: ["orders"],
    }),
    getVendorDisputes: builder.query<any, void>({
      query: () => ({
        url: "/orders/disputes/vendor",
        method: "GET",
      }),
      providesTags: ["orders"],
    }),
    createDispute: builder.mutation<any, { orderId: string; reason: string; description: string; evidence?: any }>({
      query: ({ orderId, ...body }) => ({
        url: `/orders/${orderId}/dispute`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["orders"],
    }),
    cancelOrder: builder.mutation<any, { orderId: string; reason?: string; notes?: string }>({
      query: ({ orderId, ...body }) => ({
        url: `/orders/${orderId}/cancel`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["orders", "payments"],
    }),
    acceptDelivery: builder.mutation<any, { orderId: string; note?: string }>({
      query: ({ orderId, ...body }) => ({
        url: `/orders/${orderId}/accept-delivery`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["orders", "payments"],
    }),
    declineDelivery: builder.mutation<any, { orderId: string; reason: string; notes?: string; milestoneId?: string }>({
      query: ({ orderId, ...body }) => ({
        url: `/orders/${orderId}/decline-delivery`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["orders"],
    }),
    respondToDispute: builder.mutation<any, { disputeId: string; responseText: string; attachments?: string[] }>({
      query: ({ disputeId, ...body }) => ({
        url: `/orders/disputes/${disputeId}/respond`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["orders"],
    }),
    acceptDisputeRefund: builder.mutation<any, { disputeId: string }>({
      query: ({ disputeId }) => ({
        url: `/orders/disputes/${disputeId}/accept-refund`,
        method: "POST",
      }),
      invalidatesTags: ["orders", "payments"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetClientOrdersQuery,
  useGetVendorOrdersQuery,
  useGetOrderByIdQuery,
  useApproveMilestoneMutation,
  useSubmitMilestoneDeliveryMutation,
  useDeliverOrderMutation,
  useAcceptDeliveryMutation,
  useDeclineDeliveryMutation,
  useGetPaymentLedgerQuery,
  useCreateReviewMutation,
  useGetClientDisputesQuery,
  useGetVendorDisputesQuery,
  useCreateDisputeMutation,
  useRespondToDisputeMutation,
  useAcceptDisputeRefundMutation,
  useCancelOrderMutation,
} = ordersApi;


