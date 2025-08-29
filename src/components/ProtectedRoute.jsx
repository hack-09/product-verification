// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function ProtectedRoute() {
    const { user, initializing } = useAuth();

    if (initializing) return <div style={{ padding: 24 }}>Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;

    return <Outlet />; // renders child routes
}