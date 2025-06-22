import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If logged in but not admin, redirect to home
  if (user.role !== "admin") {
    return <Navigate to="/" />;
  }

  // If admin, allow access
  return children;
};

export default AdminRoute;
