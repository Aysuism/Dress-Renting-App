import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./base-query";

export const categoriesApi = createApi({
  reducerPath: "categoriesApi",
  baseQuery: baseQuery('/categories'),
  tagTypes: ["Categories"],
  endpoints: (build) => ({
    getCategories: build.query({
      query: () => "",
      providesTags: ["Categories"],
    }),

    addCategories: build.mutation({
      query: (formData) => ({
        url: "",
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Categories"],
    }),

    updateCategories: build.mutation({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Categories"],
    }),

    deleteCategories: build.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),
  }),
})

export const {
  useGetCategoriesQuery,
  useAddCategoriesMutation,
  useUpdateCategoriesMutation,
  useDeleteCategoriesMutation,
} = categoriesApi;