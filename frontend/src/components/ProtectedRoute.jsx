import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, adminOnly = false }) {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && user?.role !== "admin") {
        return <Navigate to="/user-dashboard" replace />;
    }

    return children;
}