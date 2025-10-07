import { configureStore } from "@reduxjs/toolkit";
import { productsApi } from "./product";
import { authApi } from "./auth";
import authReducer from './authSlice';
import { categoriesApi } from "./categories";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false, })
      .concat(authApi.middleware)
      .concat(productsApi.middleware)
      .concat(categoriesApi.middleware)

});

export default store;