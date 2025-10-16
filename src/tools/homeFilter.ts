import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface ColorAndSize {
  color: string;
  size: string;
  imageUrls: string[];
}

export interface Offer {
  id: number;
  offerType: string;
  price: number;
  rentDuration?: number | null;
  productCondition: string;
}

export interface Product {
  userName: string;
  userSurname: string;
  userEmail: string;
  userPhone: string;
  productCode: string;
  subcategoryId: number;
  price: number;
  gender: string;
  description: string;
  userId?: number | null;
  colorAndSizes: ColorAndSize[];
  createdAt: string;
  offers: Offer[];
}

export const homeApi = createApi({
  reducerPath: 'homeApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://109.123.252.254:8081/api/v1/' }),
  endpoints: (builder) => ({
    getByOfferType: builder.query<Product[], { offerType: string; productCondition: string }>({
      query: ({ offerType, productCondition }) =>
        `products/get-by-Offer-Type?offerType=${offerType}&productCondition=${productCondition}`,
    }),
    filterProducts: builder.query<Product[], { subcategoryId?: number; color?: string; size?: string; gender?: string; minPrice?: number; maxPrice?: number }>({
      query: ({ subcategoryId, color, size, gender, minPrice, maxPrice }) => {
        const params = new URLSearchParams();
        if (subcategoryId) params.append('subcategoryId', subcategoryId.toString());
        if (size) params.append('size', size);
        if (gender) params.append('gender', gender);
        if (color) params.append('color', color);
        if (minPrice) params.append('minPrice', minPrice.toString());
        if (maxPrice) params.append('maxPrice', maxPrice.toString());
        return `products/filter?${params.toString()}`;
      },
    }),
  }),
});

export const { useGetByOfferTypeQuery, useFilterProductsQuery } = homeApi;