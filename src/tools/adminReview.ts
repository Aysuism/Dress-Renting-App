import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "./base-query";

export const adminReviewApi = createApi({
  reducerPath: "adminreviewApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/admin-controller`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  tagTypes: ["AdminReview"],
  endpoints: (build) => ({
    getAllProducts: build.query({
      query: () => "/all-products",
      providesTags: ["AdminReview"],
    }),

    approveProduct: build.mutation<void, string | number>({
      query: (productCode) => ({
        url: `/approve-product?productCode=${productCode}`,
        method: "POST",
      }),
      invalidatesTags: ["AdminReview"],
    }),


    disapproveProduct: build.mutation<void, string | number>({
      query: (productCode) => ({
        url: `/disapprove-product?productCode=${productCode}`,
        method: "POST",
      }),
      invalidatesTags: ["AdminReview"],
    }),

  }),
});

export const {
  useGetAllProductsQuery,
  useApproveProductMutation,
  useDisapproveProductMutation,
} = adminReviewApi;