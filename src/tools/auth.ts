import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { BASE_URL } from "./base-query";

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

// --- Base Query with Token Check ---
const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("token");
        if (token) headers.set("Authorization", `Bearer ${token}`);
        return headers;
    },
});

// --- Wrapper for Expired Token Handling ---
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    const result = await baseQuery(args, api, extraOptions);

    if (result.error && (result.error.status === 401 || result.error.status === 403)) {
        // Token expired or unauthorized → remove token and redirect
        localStorage.removeItem("token");
        localStorage.removeItem("loggedInUser");

        // Optional: reset Redux state if you want
        api.dispatch({ type: "auth/logout" });

        // Redirect to home
        window.location.href = "/";
    }

    return result;
};

// --- API Definition ---
export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: baseQueryWithReauth,
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