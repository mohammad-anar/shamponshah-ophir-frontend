/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClientProfile: builder.query<any, void>({
      query: () => ({
        url: "/users/profile/client",
        method: "GET",
      }),
      providesTags: ["auth"],
    }),
    updateClientProfile: builder.mutation<any, any>({
      query: (body) => ({
        url: "/users/profile/client",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["auth"],
    }),
    getClientOverview: builder.query<any, void>({
      query: () => ({
        url: "/users/overview/client",
        method: "GET",
      }),
      providesTags: ["orders", "jobs", "events"],
    }),
    getVendorOverview: builder.query<any, void>({
      query: () => ({
        url: "/users/overview/vendor",
        method: "GET",
      }),
      providesTags: ["orders", "offers", "gigs", "payments", "jobs"],
    }),
  }),
});

export const {
  useGetClientProfileQuery,
  useUpdateClientProfileMutation,
  useGetClientOverviewQuery,
  useGetVendorOverviewQuery,
} = userApi;
