import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // You can return a spinner here if you want
    return null;
  }

  // Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required and user doesn't match → optional: show 403 page
  if (role && user.role !== role) {
    return <Navigate to="/login" replace />; // or to "/forbidden"
  }

  // Allowed
  return children;
};

export default ProtectedRoute;
