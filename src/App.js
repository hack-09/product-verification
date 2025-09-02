// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyProduct from "./pages/VerifyProduct";
import ProductDetails from "./components/ProductDetails";
import CompanyDashboard from "./pages/CompanyDashboard";
import RetailerDashboard from "./pages/RetailerDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import Unauthorized from "./components/Unauthorized";
import "./App.css";

export default function App() {
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const role = authUser?.role;

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/verify" element={<VerifyProduct />} />
            <Route path="/verify/:id" element={<ProductDetails />} />

            {/* Dashboards must end with /* if they have nested routes */}
            {role==="company" && (<Route path="/company/*" element={<CompanyDashboard />} />)}
            {role==="retailer" && (<Route path="/retailer/*" element={<RetailerDashboard />} />)}
            {role==="customer" && (<Route path="/customer/*" element={<CustomerDashboard />} />)}
          </Route>

          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route path="*" element={<Navigate to="/login" replace />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
