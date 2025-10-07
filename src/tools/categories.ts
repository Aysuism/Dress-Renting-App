import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./base-query";

export const categoriesApi = createApi({
  reducerPath: "categoriesApi",
  baseQuery: baseQuery("/categories"), // already includes /categories
  tagTypes: ["Categories"],
  endpoints: (build) => ({
    getCategories: build.query({
      query: () => "", // GET /categories
      providesTags: ["Categories"],
    }),

    addCategories: build.mutation({
      query: (formData: FormData) => ({
        url: "", // POST /categories
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Categories"],
    }),

    updateCategories: build.mutation({
      query: ({ id, data }) => ({
        url: `/${id}`, // PUT /categories/{id}
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Categories"],
    }),

    deleteCategories: build.mutation({
      query: (id) => ({
        url: `/${id}`, // DELETE /categories/{id}
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