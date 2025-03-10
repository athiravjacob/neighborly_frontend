// src/components/ProtectedRoute.tsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../../../redux/store";

const ProtectedRoutes: React.FC = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  console.log("ProtectedRoute - accessToken:", accessToken); // Debug

  if (!accessToken) {
    return <Navigate to="/signup" replace />;
  }

  return <Outlet />; // Renders nested routes
};

export default ProtectedRoutes;