/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<any, void>({
      query: () => ({
        url: "/categories",
        method: "GET",
      }),
      providesTags: ["categories"],
    }),
    getCategoryBySlug: builder.query<any, string>({
      query: (slug) => ({
        url: `/categories/${slug}`,
        method: "GET",
      }),
      providesTags: (_res, _err, slug) => [{ type: "categories", id: slug }],
    }),
    getAdminCategories: builder.query<any, void>({
      query: () => ({
        url: "/categories/admin/all",
        method: "GET",
      }),
      providesTags: ["categories"],
    }),
    createCategory: builder.mutation<any, { name: string; slug: string; description?: string; image?: string; imageUrl?: string; icon?: string; sortOrder?: number; order?: number; parentId?: string }>({
      query: (body) => ({
        url: "/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["categories"],
    }),
    updateCategory: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["categories"],
    }),
    deleteCategory: builder.mutation<any, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["categories"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetAdminCategoriesQuery,
  useGetCategoryBySlugQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;

