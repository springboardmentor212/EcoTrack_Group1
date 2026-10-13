import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  if (!token || !user) return <Navigate to="/login" replace />;

  const role = user.role || "user";

  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <Navigate
        to={role === "admin" ? "/admin/users" : "/user-dashboard"}
        replace
      />
    );
  }

  return children;
}
