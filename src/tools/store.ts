import { configureStore } from "@reduxjs/toolkit";
import { productsApi } from "./product";
import { authApi } from "./auth";
import authReducer from './authSlice';
import { categoriesApi } from "./categories";
import { adminReviewApi } from "./adminReview";
import { subcategoriesApi } from "./subCategory";
import { favoritesApi } from "./wishlist";
import { homeApi } from "./homeFilter";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [adminReviewApi.reducerPath]: adminReviewApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [subcategoriesApi.reducerPath]: subcategoriesApi.reducer,
    [homeApi.reducerPath]: homeApi.reducer,
    [favoritesApi.reducerPath]: favoritesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false, })
      .concat(authApi.middleware)
      .concat(adminReviewApi.middleware)
      .concat(productsApi.middleware)
      .concat(categoriesApi.middleware)
      .concat(subcategoriesApi.middleware)
      .concat(homeApi.middleware)
      .concat(favoritesApi.middleware)

});

export default store;