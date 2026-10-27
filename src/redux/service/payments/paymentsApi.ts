/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation<any, { orderId: string; paymentMethodId?: string }>({
      query: (body) => ({
        url: "/payments/intent",
        method: "POST",
        body,
      }),
      invalidatesTags: ["payments", "orders"],
    }),
    createSetupIntent: builder.mutation<{ clientSecret: string; customerId?: string }, void>({
      query: () => ({
        url: "/payments/setup-intent",
        method: "POST",
      }),
    }),
    getPaymentMethods: builder.query<any, void>({
      query: () => ({
        url: "/payments/methods",
        method: "GET",
      }),
      providesTags: ["payments"],
    }),
    savePaymentMethod: builder.mutation<any, {
      paymentMethodId: string;
      brand?: string;
      last4?: string;
      expMonth?: number;
      expYear?: number;
      isDefault?: boolean;
    }>({
      query: (body) => ({
        url: "/payments/methods/save",
        method: "POST",
        body,
      }),
      invalidatesTags: ["payments"],
    }),
    setDefaultPaymentMethod: builder.mutation<any, string>({
      query: (id) => ({
        url: `/payments/methods/${id}/default`,
        method: "PATCH",
      }),
      invalidatesTags: ["payments"],
    }),
    removePaymentMethod: builder.mutation<any, string>({
      query: (id) => ({
        url: `/payments/methods/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["payments"],
    }),
    getVendorEarnings: builder.query<any, void>({
      query: () => ({
        url: "/payments/vendor/earnings",
        method: "GET",
      }),
      providesTags: ["payments"],
    }),
    withdrawEarnings: builder.mutation<any, { amount: number; speed?: "standard" | "instant" }>({
      query: (body) => ({
        url: "/payments/vendor/withdraw",
        method: "POST",
        body,
      }),
      invalidatesTags: ["payments"],
    }),
    getBidCredits: builder.query<any, void>({
      query: () => ({
        url: "/payments/vendor/bid-credits",
        method: "GET",
      }),
      providesTags: ["vendors"],
    }),
    purchaseBidCredits: builder.mutation<any, { credits: number; paymentMethodId: string }>({
      query: (body) => ({
        url: "/payments/vendor/bid-credits",
        method: "POST",
        body,
      }),
      invalidatesTags: ["vendors"],
    }),
    getBidCreditPackages: builder.query<any, void>({
      query: () => ({
        url: "/payments/bid-credit-packages",
        method: "GET",
      }),
      providesTags: ["payments"],
    }),
    connectStripe: builder.mutation<{ url: string }, void>({
      query: () => ({
        url: "/payments/vendor/connect/stripe",
        method: "POST",
      }),
      invalidatesTags: ["vendors", "payments"],
    }),
    getStripeStatus: builder.query<any, void>({
      query: () => ({
        url: "/payments/vendor/connect/stripe/status",
        method: "GET",
      }),
      providesTags: ["vendors", "payments"],
    }),
    getStripePortal: builder.query<{ url: string }, void>({
      query: () => ({
        url: "/payments/vendor/connect/stripe/portal",
        method: "GET",
      }),
    }),
    updateVendorPayoutPreferences: builder.mutation<any, {
      payoutSchedule?: string;
      bankName?: string;
      accountNumber?: string;
      routingNumber?: string;
      instantDebitCard?: string;
    }>({
      query: (body) => ({
        url: "/payments/vendor/payout-settings",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["vendors", "payments"],
    }),
    createDispute: builder.mutation<any, { orderId: string; reason: string; description: string }>({
      query: (body) => ({
        url: "/payments/disputes",
        method: "POST",
        body,
      }),
      invalidatesTags: ["orders", "payments"],
    }),
    getClientDisputes: builder.query<any, void>({
      query: () => ({
        url: "/payments/disputes/client",
        method: "GET",
      }),
      providesTags: ["payments"],
    }),
    getVendorDisputes: builder.query<any, void>({
      query: () => ({
        url: "/payments/disputes/vendor",
        method: "GET",
      }),
      providesTags: ["payments"],
    }),
    createOrderPaymentIntent: builder.mutation<
      {
        clientSecret: string;
        paymentIntentId: string;
        orderId: string;
        orderNumber?: string;
        amount: number;
        platformFee: number;
        vendorNet: number;
        paymentStatus: string;
      },
      { orderId: string; idempotencyKey?: string }
    >({
      query: (body) => ({
        url: "/payments/order-intent",
        method: "POST",
        body,
      }),
      invalidatesTags: ["payments", "orders"],
    }),
    confirmOrderPayment: builder.mutation<
      {
        success: boolean;
        orderId: string;
        orderNumber?: string;
        status: string;
        paymentStatus: string;
        amount: number;
        platformFee: number;
        vendorNet: number;
      },
      { orderId: string; paymentIntentId: string; idempotencyKey?: string }
    >({
      query: (body) => ({
        url: "/payments/confirm-order-payment",
        method: "POST",
        body,
      }),
      invalidatesTags: ["payments", "orders"],
    }),
    payOrder: builder.mutation<
      {
        success: boolean;
        orderId: string;
        orderNumber?: string;
        status: string;
        paymentStatus: string;
        amount: number;
        platformFee: number;
        vendorNet: number;
      },
      {
        orderId: string;
        paymentMethodId?: string;
        cardNumber?: string;
        cardExpiry?: string;
        cardCvc?: string;
        cardholderName?: string;
        saveCard?: boolean;
      }
    >({
      query: (body) => ({
        url: "/payments/pay-order",
        method: "POST",
        body,
      }),
      invalidatesTags: ["payments", "orders", "vendors"],
    }),
    getVendorWallet: builder.query<
      {
        walletId: string;
        vendorProfileId: string;
        pendingAmount: number;
        pendingForReleaseAmount: number;
        availableAmount: number;
        totalEarned: number;
        totalWithdrawn: number;
        ledgerEntries: Array<{
          id: string;
          orderId?: string | null;
          orderNumber?: string | null;
          type: string;
          gross: number;
          platformFee: number;
          vendorNet: number;
          status: string;
          clearingEndsAt?: string | null;
          description?: string | null;
          createdAt: string;
        }>;
      },
      void
    >({
      query: () => ({
        url: "/payments/vendor/wallet",
        method: "GET",
      }),
      providesTags: ["payments", "orders"],
    }),
  }),
});

export const {
  useCreatePaymentIntentMutation,
  useCreateSetupIntentMutation,
  useGetPaymentMethodsQuery,
  useSavePaymentMethodMutation,
  useSetDefaultPaymentMethodMutation,
  useRemovePaymentMethodMutation,
  useGetVendorEarningsQuery,
  useWithdrawEarningsMutation,
  useGetBidCreditsQuery,
  usePurchaseBidCreditsMutation,
  useGetBidCreditPackagesQuery,
  useConnectStripeMutation,
  useGetStripeStatusQuery,
  useGetStripePortalQuery,
  useLazyGetStripePortalQuery,
  useUpdateVendorPayoutPreferencesMutation,
  useCreateDisputeMutation,
  useGetClientDisputesQuery,
  useGetVendorDisputesQuery,
  useCreateOrderPaymentIntentMutation,
  useConfirmOrderPaymentMutation,
  usePayOrderMutation,
  useGetVendorWalletQuery,
} = paymentsApi;
