import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./base-query";

export interface FavoriteItem {
  id: string;
  productCode: string;
}

export interface AddFavoriteRequest {
  productCode: string;
}

export const favoritesApi = createApi({
  reducerPath: "favoritesApi",
  baseQuery: baseQuery("/favorites"),
  tagTypes: ["Favorites"],
  endpoints: (build) => ({
    getFavorites: build.query<FavoriteItem[], void>({
      query: () => ({
        url: "",
        method: "GET",
      }),
      providesTags: ["Favorites"],
    }),

    addFavorite: build.mutation<FavoriteItem, AddFavoriteRequest>({
      query: (body) => ({
        url: "",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Favorites"],
    }),

    removeFavorite: build.mutation<void, string>({
      query: (productCode) => ({
        url: "",
        method: "DELETE",
        params: { productCode },
      }),
      invalidatesTags: ["Favorites"],
    }),

 
  }),
});

export const {
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} = favoritesApi;