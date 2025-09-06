import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Clothes } from "../components/Card";


export const clothesApi = createApi({
  reducerPath: "clothesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8081/api/v1/products",
    prepareHeaders: (headers, { getState }) => {
      const token = getTokenFromStorage();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Clothes"],
  endpoints: (build) => ({
    getClothes: build.query<Clothes[], { offerType?: string; productCondition?: string }>({
      query: (params) => ({
        url: "/get-by-Offer-Type",
        params: params,
        responseHandler: (response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        },
      }),
      providesTags: ["Clothes"],
      transformResponse: (response: any) => {
        if (Array.isArray(response)) {
          return response;
        }
        if (response && response.data && Array.isArray(response.data)) {
          return response.data;
        }
        if (response && typeof response === 'object') {
          return [response];
        }
        return [];
      },
    }),
    addClothes: build.mutation({
      query: (formData: FormData) => ({
        url: "/upload",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Clothes"],
    }),
  }),
});
// Helper function to get token from storage
const getTokenFromStorage = () => {
  // Try to get token from cookies
  const cookieToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];

  if (cookieToken) return cookieToken;

  // Try to get token from localStorage as fallback
  return localStorage.getItem('token');
};

export const { useGetClothesQuery, useAddClothesMutation } = clothesApi;