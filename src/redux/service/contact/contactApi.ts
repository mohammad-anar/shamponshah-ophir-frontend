/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitInquiry: builder.mutation<any, {
      name: string;
      email: string;
      phone?: string;
      topic: string;
      message: string;
    }>({
      query: (body) => ({
        url: "/contact/inquiry",
        method: "POST",
        body,
      }),
    }),
    submitVendorApplication: builder.mutation<any, {
      businessName: string;
      category: string;
      city: string;
      portfolioUrl?: string;
      email?: string;
      phone?: string;
    }>({
      query: (body) => ({
        url: "/contact/apply-artisan",
        method: "POST",
        body,
      }),
      invalidatesTags: ["vendors"],
    }),
    subscribeNewsletter: builder.mutation<any, { email: string }>({
      query: (body) => ({
        url: "/contact/newsletter",
        method: "POST",
        body,
      }),
    }),
    getFaqs: builder.query<any, void>({
      query: () => ({
        url: "/contact/faqs",
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useSubmitInquiryMutation,
  useSubmitVendorApplicationMutation,
  useSubscribeNewsletterMutation,
  useGetFaqsQuery,
} = contactApi;

// Backwards compatibility alias
export const useSubmitArtisanApplicationMutation = useSubmitVendorApplicationMutation;


