import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "./authSlice";


export const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const baseQuery = (path: string) => {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl: `${BASE_URL}${path}`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  return async (args: any, api: any, extraOptions: any) => {
    const result = await rawBaseQuery(args, api, extraOptions);
    if (result.error?.status === 401) {
      const state = api.getState();
      const isAuthenticated = !!state.auth.token;

      if (isAuthenticated) {
        api.dispatch(logout());
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    }
    return result;
  };
};
