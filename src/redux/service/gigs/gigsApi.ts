/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

export const gigsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicGigs: builder.query<any, {
      page?: number;
      limit?: number;
      search?: string;
      categoryId?: string;
      minPrice?: number;
      maxPrice?: number;
    } | void>({
      query: (params) => ({
        url: "/gigs",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["gigs"],
    }),
    getGigBySlug: builder.query<any, string>({
      query: (slug) => ({
        url: `/gigs/${slug}`,
        method: "GET",
      }),
      providesTags: (_res, _err, slug) => [{ type: "gigs", id: slug }],
    }),
    getVendorGigs: builder.query<any, void>({
      query: () => ({
        url: "/vendor/gigs",
        method: "GET",
      }),
      providesTags: ["gigs"],
    }),
    createGig: builder.mutation<any, any>({
      query: (body) => ({
        url: "/vendor/gigs",
        method: "POST",
        body,
      }),
      invalidatesTags: ["gigs"],
    }),
    updateGig: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/vendor/gigs/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["gigs"],
    }),
    deleteGig: builder.mutation<any, string>({
      query: (id) => ({
        url: `/vendor/gigs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["gigs"],
    }),
    createGigPackage: builder.mutation<any, { gigId: string; data: any }>({
      query: ({ gigId, data }) => ({
        url: `/vendor/gigs/${gigId}/packages`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["gigs"],
    }),
    reportGig: builder.mutation<any, { gigId: string; reason: string; description: string; reporterName?: string; reporterEmail?: string }>({
      query: ({ gigId, ...body }) => ({
        url: `/gigs/${gigId}/report`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["admin"],
    }),
  }),
});

export const {
  useGetPublicGigsQuery,
  useGetGigBySlugQuery,
  useGetVendorGigsQuery,
  useCreateGigMutation,
  useUpdateGigMutation,
  useDeleteGigMutation,
  useCreateGigPackageMutation,
  useReportGigMutation,
} = gigsApi;
