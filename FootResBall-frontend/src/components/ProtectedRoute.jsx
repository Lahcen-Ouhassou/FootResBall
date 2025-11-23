import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

// had components kay7mi bli my9derch ayy wahd ichuf ga3 les pages la mknch endo Token
