/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

export const vendorsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVendors: builder.query<any, {
      category?: string;
      city?: string;
      minRating?: number;
      tier?: string;
      search?: string;
      page?: number;
      limit?: number;
      seed?: string;
      sortBy?: string;
    } | void>({
      query: (params) => ({
        url: "/vendors",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["vendors"],
    }),
    getVendorBySlug: builder.query<any, string>({
      query: (slug) => ({
        url: `/vendors/profile/${slug}`,
        method: "GET",
      }),
      providesTags: (_res, _err, slug) => [{ type: "vendors", id: slug }],
    }),
    getMyVendorProfile: builder.query<any, void>({
      query: () => ({
        url: "/vendors/me",
        method: "GET",
      }),
      providesTags: ["vendors"],
    }),
    submitVendorOnboarding: builder.mutation<any, any>({
      query: (body) => ({
        url: "/vendors/onboarding",
        method: "POST",
        body,
      }),
      invalidatesTags: ["vendors"],
    }),
    updateVendorProfile: builder.mutation<any, any>({
      query: (body) => ({
        url: "/vendors/me",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["vendors"],
    }),
    toggleVacationMode: builder.mutation<any, { isVacationMode: boolean; vacationEndsAt?: string }>({
      query: (body) => ({
        url: "/vendors/vacation",
        method: "POST",
        body,
      }),
      invalidatesTags: ["vendors"],
    }),
    getVendorAnalytics: builder.query<any, string | void>({
      query: (range) => ({
        url: "/vendors/analytics",
        method: "GET",
        params: range ? { range } : undefined,
      }),
      providesTags: ["vendors", "orders", "payments"],
    }),
    getBlockedDates: builder.query<any, void>({
      query: () => ({
        url: "/vendors/calendar/blocked-dates",
        method: "GET",
      }),
      providesTags: ["vendors"],
    }),
    addBlockedDate: builder.mutation<any, { date: string; reason?: string }>({
      query: (body) => ({
        url: "/vendors/calendar/blocked-dates",
        method: "POST",
        body,
      }),
      invalidatesTags: ["vendors"],
    }),
    removeBlockedDate: builder.mutation<any, string>({
      query: (id) => ({
        url: `/vendors/calendar/blocked-dates/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["vendors"],
    }),
    addPortfolioItem: builder.mutation<any, { url: string; caption?: string; type?: string }>({
      query: (body) => ({
        url: "/vendors/portfolio",
        method: "POST",
        body,
      }),
      invalidatesTags: ["vendors"],
    }),
    deletePortfolioItem: builder.mutation<any, string>({
      query: (id) => ({
        url: `/vendors/portfolio/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["vendors"],
    }),
    toggleSaveVendor: builder.mutation<any, string>({
      query: (vendorId) => ({
        url: `/vendors/${vendorId}/save`,
        method: "POST",
      }),
      invalidatesTags: ["vendors"],
    }),
    getSavedVendors: builder.query<any, void>({
      query: () => ({
        url: "/vendors/saved/list",
        method: "GET",
      }),
      providesTags: ["vendors"],
    }),
    getVendorShowcase: builder.query<any, void>({
      query: () => ({
        url: "/vendors/showcase",
        method: "GET",
      }),
      providesTags: ["vendors"],
    }),
  }),
});

export const {
  useGetVendorsQuery,
  useGetVendorBySlugQuery,
  useGetMyVendorProfileQuery,
  useSubmitVendorOnboardingMutation,
  useUpdateVendorProfileMutation,
  useToggleVacationModeMutation,
  useGetVendorAnalyticsQuery,
  useGetBlockedDatesQuery,
  useAddBlockedDateMutation,
  useRemoveBlockedDateMutation,
  useAddPortfolioItemMutation,
  useDeletePortfolioItemMutation,
  useToggleSaveVendorMutation,
  useGetSavedVendorsQuery,
  useGetVendorShowcaseQuery,
} = vendorsApi;

export const useSaveVendorMutation = useToggleSaveVendorMutation;
