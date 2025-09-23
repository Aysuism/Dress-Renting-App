// tools/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { clothesApi } from "./product";
import { fakeProductsSlice } from "./fakeApi";
import { authApi } from "./auth";
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [clothesApi.reducerPath]: clothesApi.reducer,
    [fakeProductsSlice.reducerPath]: fakeProductsSlice.reducer,
    // Remove or comment out the auth reducer if you don't have it
    // auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false, })
      .concat(authApi.middleware)
      .concat(clothesApi.middleware)

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;