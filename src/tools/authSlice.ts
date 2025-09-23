// src/features/auth/authSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
    id: number;
    name: string;
    surname: string;
    email: string;
    phone: string;
    userRole: "ADMIN" | "USER";
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"),
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ token: string }>
        ) => {
            state.token = action.payload.token;
            state.isAuthenticated = true;
            localStorage.setItem("token", action.payload.token);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem("token");
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;