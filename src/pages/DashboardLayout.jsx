// src/components/DashboardLayout.jsx
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";

export default function DashboardLayout({ children, role }) {
  const { user, signOutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSignOut = async () => {
    localStorage.removeItem("authUser");
    await signOutUser();
    navigate("/login");
  };

  // Sidebar links vary by role
  const sidebarLinks = {
    company: [
      { to: "/company", label: "Overview", icon: "📊" },
      { to: "/company/add-product", label: "Add Product", icon: "➕" },
      { to: "/company/products", label: "Products", icon: "📦" },
    ],
    retailer: [
      { to: "/retailer", label: "Overview", icon: "📊" },
      { to: "/retailer/scan", label: "Scan", icon: "📱" },
      { to: "/retailer/history", label: "History", icon: "🕒" },
    ],
    customer: [
      { to: "/customer", label: "Overview", icon: "📊" },
      { to: "/customer/scan", label: "Scan", icon: "📱" },
      { to: "/customer/history", label: "History", icon: "✅" },
    ],
  };

  // Get current role links or default to customer
  const currentLinks = sidebarLinks[role] || sidebarLinks.customer;

  // Determine the current page for active styling
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Collapsible Sidebar */}
      <div 
        className={`bg-indigo-800 text-white transition-all duration-300 ${
          isSidebarCollapsed ? "w-16" : "w-52"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Brand section */}
          <div className="flex items-center justify-between h-14 px-4 bg-indigo-900">
            {!isSidebarCollapsed && <h1 className="text-lg font-bold">TrueCheck</h1>}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1 rounded hover:bg-indigo-700"
            >
              {isSidebarCollapsed ? "→" : "←"}
            </button>
          </div>

          {/* User info - only show when expanded */}
          {!isSidebarCollapsed && (
            <div className="p-3 border-b border-indigo-700">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                  {user?.displayName
                    ? user.displayName.charAt(0).toUpperCase()
                    : user?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="ml-2 truncate">
                  <p className="text-xs font-medium truncate">
                    {user?.displayName || user?.email}
                  </p>
                  <p className="text-xs text-indigo-200 capitalize">{role}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-2 py-3 overflow-y-auto">
            <div className="space-y-1">
              {currentLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActiveLink(link.to)
                      ? "bg-indigo-900 text-white"
                      : "text-indigo-100 hover:bg-indigo-700"
                  }`}
                  title={isSidebarCollapsed ? link.label : ""}
                >
                  <span className="text-base">{link.icon}</span>
                  {!isSidebarCollapsed && <span className="ml-3">{link.label}</span>}
                </Link>
              ))}
            </div>
          </nav>

          {/* Sign out section */}
          <div className="p-3 border-t border-indigo-700">
            <button
              onClick={handleSignOut}
              className={`flex items-center w-full px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500 transition-colors ${
                isSidebarCollapsed ? "justify-center" : ""
              }`}
              title={isSidebarCollapsed ? "Sign out" : ""}
            >
              <span>🚪</span>
              {!isSidebarCollapsed && <span className="ml-2">Sign out</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header bar */}
        <header className="bg-white border-b h-14 flex items-center justify-between px-4 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {currentLinks.find(link => isActiveLink(link.to))?.label || "Dashboard"}
            </h2>
          </div>
          
          {/* Mobile menu button - only shown on small screens */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-600"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            {isSidebarCollapsed ? "☰" : "✕"}
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
        {<Footer />}
      </div>
    </div>
  );
}