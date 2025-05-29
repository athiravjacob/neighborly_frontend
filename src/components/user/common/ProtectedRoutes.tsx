// src/components/ProtectedRoute.tsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../../../redux/store";
import { useDispatch } from "react-redux";
import { clearCredentials } from "../../../redux/slices/authSlice";

const ProtectedRoutes: React.FC = () => {
  const { user,isAuthenticated } = useSelector((state: RootState) => state.auth);
  console.log(user)

  if (!isAuthenticated || user?.type !== 'user' ) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />; 
};

export default ProtectedRoutes;