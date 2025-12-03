import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./base-query";

export const subcategoriesApi = createApi({
  reducerPath: "subcategoriesApi",
  baseQuery: baseQuery('/sub-categories'),
  tagTypes: ["Subcategories"],
  endpoints: (build) => ({
    getSubcategories: build.query({
      query: () => "",
      providesTags: ["Subcategories"],
    }),

    addSubcategory: build.mutation({
      query: (formData) => ({
        url: "",
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Subcategories"],
    }),

    updateSubcategory: build.mutation({
      query: ({ id, data }: { id: number | string; data: FormData | object }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Subcategories"],
    }),

    deleteSubcategory: build.mutation({
      query: (id: number | string) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subcategories"],
    }),
  }),
});

export const {
  useGetSubcategoriesQuery,
  useAddSubcategoryMutation,
  useUpdateSubcategoryMutation,
  useDeleteSubcategoryMutation,
} = subcategoriesApi;