// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetails from "./components/ProductDetails";
import CompanyDashboard from "./pages/CompanyDashboard";
import RetailerDashboard from "./pages/RetailerDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import VerifyProduct from "./pages/VerifyProduct";
import LandingPage from "./pages/LandingPage";
import "./App.css";

export default function App() {
  const role = localStorage.getItem("authUser") ? JSON.parse(localStorage.getItem("authUser")).role : null;
  return (
    <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          {!role && <Route path="/" element={<LandingPage />} />}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<VerifyProduct />} />
          <Route path="/verify/:id" element={<ProductDetails />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute allowedRoles={["company", "retailer", "customer"]} />}>
            <Route path=":role/products/verify/:id" element={<ProductDetails />} />
          </Route>

          {/* Role-specific dashboards */}
          <Route
            path="/company/*"
            element={
              <ProtectedRoute allowedRoles={["company"]}>
                <CompanyDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/retailer/*"
            element={
              <ProtectedRoute allowedRoles={["retailer"]}>
                <RetailerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer/*"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Login />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  );
}
