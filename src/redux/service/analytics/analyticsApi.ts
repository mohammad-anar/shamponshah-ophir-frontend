/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    trackEvents: builder.mutation<any, { visitorId: string; sessionId?: string; events: any[] }>({
      query: (body) => ({
        url: "/analytics/track",
        method: "POST",
        body,
      }),
    }),
    getVendorComprehensiveAnalytics: builder.query<any, { range?: string; gigId?: string } | void>({
      query: (params) => ({
        url: "/analytics/vendor",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["vendors", "orders"],
    }),
  }),
});

export const {
  useTrackEventsMutation,
  useGetVendorComprehensiveAnalyticsQuery,
} = analyticsApi;
