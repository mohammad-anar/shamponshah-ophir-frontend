import { baseApi } from "@/redux/api/baseApi";

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation<{ success: boolean; url: string; relativeUrl?: string; filename?: string }, FormData>({
      query: (formData) => ({
        url: "/upload",
        method: "POST",
        body: formData,
      }),
    }),
    uploadMultipleFiles: builder.mutation<{ success: boolean; urls: string[]; files: any[] }, FormData>({
      query: (formData) => ({
        url: "/upload/multiple",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useUploadFileMutation, useUploadMultipleFilesMutation } = uploadApi;
