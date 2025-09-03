import { configureStore } from "@reduxjs/toolkit";
import { clothesApi } from "./product";

const store = configureStore({
  reducer: {
    [clothesApi.reducerPath]: clothesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(clothesApi.middleware),
});

export default store;
