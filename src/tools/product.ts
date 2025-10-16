import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./base-query";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: baseQuery("/products"),
  tagTypes: ["Products"],
  endpoints: (build) => ({
    getProducts: build.query({
      query: () => '/all-products',
      providesTags: ['Products'],
    }),
    addProducts: build.mutation({
      query: (formData: FormData) => ({
        url: "/upload",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Products"],
    }),

    updateProductStatus: build.mutation({
      query: ({ productCode, formData }) => ({
        url: `/${productCode}/upload`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['Products'],
    }),

    deleteProducts: build.mutation({
      query: (productCode) => ({
        url: `/${productCode}`,
        method: 'DELETE',
      }),
      invalidatesTags: ["Products"],
    }),

  }),
});

export const {
  useGetProductsQuery,
  useAddProductsMutation,
  useUpdateProductStatusMutation,
  useDeleteProductsMutation,
} = productsApi;