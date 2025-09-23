import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  adminOnly?: boolean;
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ adminOnly = false, children }) => {
  const storedUser = localStorage.getItem("loggedInUser");
  const token = localStorage.getItem("token");
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user || !token) {
    return <Navigate to="/admin-login" replace />;
  }

  if (adminOnly && user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;