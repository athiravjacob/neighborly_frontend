// src/components/ProtectedRoute.tsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../../../redux/store";

const ProtectedRoutes: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);


  if (!isAuthenticated) {
    return <Navigate to="/signup" replace />;
  }

  return <Outlet />; 
};

export default ProtectedRoutes;