import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


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
    // GET all clothes with optional filters
    getClothes: build.query<any[], { offerType?: string; productCondition?: string }>({
      query: (params) => ({
        url: "/get-by-Offer-Type", // Changed from "" to match your working endpoint
        params: params, // Pass the query parameters
      }),
      providesTags: ["Clothes"],
    }),

    // ADD new clothes (multipart)
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