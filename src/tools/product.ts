// tools/product.ts - UPDATED with Admin endpoints
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const clothesApi = createApi({
  reducerPath: "clothesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8081/api/v1/products",
    prepareHeaders: (headers) => {
      headers.delete("Content-Type"); // Let browser handle FormData
      return headers;
    },
  }),
  tagTypes: ["Clothes"],
  endpoints: (build) => ({
    addClothes: build.mutation({
      query: (formData: FormData) => ({
        url: "/upload",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Clothes"],
    }),

    // Admin: Get all pending products
    getPendingProducts: build.query<any[], void>({
      query: () => "/pending",
      providesTags: ["Clothes"],
    }),

    // Admin: Update product status
    updateProductStatus: build.mutation<any, { productCode: string; status: "ACTIVE" | "REJECTED" }>({
      query: ({ productCode, status }) => ({
        url: `/${productCode}/upload`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: { status },
      }),
      invalidatesTags: ["Clothes"],
    }),

  }),
});

export const {
  useAddClothesMutation,
  useGetPendingProductsQuery,
  useUpdateProductStatusMutation,
} = clothesApi;