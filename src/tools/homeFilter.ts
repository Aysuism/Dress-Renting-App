import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './base-query';

export interface ColorAndSize {
  color: string;
  sizes: string[];
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
  subcategory: {
    id: number;
    name: string;
    category: {
      id: number;
      name: string;
    };
  };
  categoryId: number;
  subCategoryId: number;
  brandId: number;
  price: number;
  gender: string;
  description: string;
  userId?: number | null;
  colorAndSizes: ColorAndSize[];
  createdAt: string;
  offers: Offer[];
  productConditions: string;
}

export const homeApi = createApi({
  reducerPath: 'homeApi',
  baseQuery: baseQuery("/products"),
  endpoints: (builder) => ({
    getByOfferType: builder.query({
      query: () => "/filter",
    }),
    filterProducts: builder.query<Product[], {
      categoryId?: number;
      subCategoryId?: number;
      brandId?: number;
      gender?: string;
      color?: string;
      sizes?: string[];
      offerType?: string;
      productCondition?: string;
      minPrice?: number;
      maxPrice?: number;
    }>({
      query: (filters) => {
        const params = new URLSearchParams();

        if (filters.categoryId) params.append("categoryId", filters.categoryId.toString());
        if (filters.subCategoryId) params.append("subCategoryId", filters.subCategoryId.toString());
        if (filters.brandId) params.append("brandId", filters.brandId.toString());
        if (filters.gender) params.append("gender", filters.gender);
        if (filters.color) params.append("color", filters.color);

        if (filters.sizes && Array.isArray(filters.sizes)) {
          filters.sizes.forEach((s) => params.append("sizes", s));
        }
        if (filters.offerType) params.append("offerType", filters.offerType);
        if (filters.productCondition) params.append("productCondition", filters.productCondition);
        if (filters.minPrice) params.append("minPrice", filters.minPrice.toString());
        if (filters.maxPrice) params.append("maxPrice", filters.maxPrice.toString());

        return `/filter?${params.toString()}`;
      },
    }),
  }),
});

export const { useGetByOfferTypeQuery, useFilterProductsQuery } = homeApi;