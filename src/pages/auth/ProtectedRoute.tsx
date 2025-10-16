import { jwtDecode } from "jwt-decode";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  adminOnly?: boolean;
  children?: React.ReactNode;
}

interface JwtPayload {
  exp: number;
  role?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ adminOnly = false, children }) => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("loggedInUser");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const isTokenValid = (token: string) => {
    try {
      const decoded: JwtPayload = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  };

  if (!token || !isTokenValid(token)) {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    return <Navigate to="/" replace />;
  }

  if (adminOnly && user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;