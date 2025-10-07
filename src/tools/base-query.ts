import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://109.123.252.254:8081/api";

export const baseQuery = (path: string) =>
    fetchBaseQuery({
        baseUrl: `${BASE_URL}${path}`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("x-auth-token", token);
            }
            return headers;
        },
    });