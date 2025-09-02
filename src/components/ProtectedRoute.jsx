// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, initializing } = useAuth();
  const storedUser = JSON.parse(localStorage.getItem("authUser")); // role stored at login
  const role = storedUser?.role;

  if (initializing) return <div style={{ padding: 24 }}>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={`/${role}`} replace />;
  }

  return children ? children : <Outlet />;
}
