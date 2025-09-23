// src/api/auth.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface LoginRequest {
    email: string;
    password: string;
}

interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

interface ProfileResponse {
    id: number;
    name: string;
    surname: string;
    email: string;
    phone: string;
    userRole: "ADMIN" | "USER";
}

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8081/api/v1",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("x-auth-token", token);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: "auth/login",
                method: "POST",
                body: credentials,
            }),
        }),
        getProfile: builder.query<ProfileResponse, void>({
            query: () => "auth/me",
        }),
    }),
});

export const { useLoginMutation, useGetProfileQuery } = authApi;