import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PublicLayout = () => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicLayout;