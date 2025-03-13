// src/components/ProtectedRoute.tsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../../../redux/store";

const ProtectedRoutes_admin: React.FC = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);


  if (!accessToken) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes_admin;