import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const subcategoriesApi = createApi({
  reducerPath: "subcategoriesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://weshare.az/api/sub-categories",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },

  }),
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