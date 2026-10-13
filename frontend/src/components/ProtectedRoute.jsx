import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
  adminOnly = false,
  allowedRoles,
}) {
  const token = localStorage.getItem("token");
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const roles = allowedRoles ?? (adminOnly ? ["admin"] : null);

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/user-dashboard" replace />;
  }

  return children;
}
