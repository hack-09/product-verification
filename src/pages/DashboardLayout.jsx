// src/components/DashboardLayout.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout({ children, role }) {
  const { user, signOutUser } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    localStorage.removeItem("authUser");
    await signOutUser();
    navigate("/login");
  };

  // Sidebar links vary slightly by role
  const sidebarLinks = {
    company: [
      { to: "/company", label: "Overview" },
      { to: "/company/add-product", label: "Add Product" },
      { to: "/company/products", label: "My Products" },
    ],
    retailer: [
      { to: "/retailer", label: "Overview" },
      { to: "/retailer/scan", label: "Scan & Verify" },
      { to: "/retailer/history", label: "Scan History" },
    ],
    customer: [
      { to: "/customer", label: "Overview" },
      { to: "/customer/scan", label: "Scan & Verify" },
      { to: "/customer/history", label: "My Verifications" },
    ],
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-white border-r p-4">
        <div className="mb-6">
          <h2 className="text-xl font-bold">TrueCheck</h2>
          <p className="text-sm text-gray-600 mt-1">Role: {role}</p>
        </div>

        <nav className="flex flex-col gap-2">
          {(sidebarLinks[role] || []).map((ln) => (
            <Link
              key={ln.to}
              to={ln.to}
              className="block px-3 py-2 rounded hover:bg-gray-100"
            >
              {ln.label}
            </Link>
          ))}
        </nav>

        <div className="mt-6 border-t pt-4">
          <div className="text-sm text-gray-700 mb-2">
            Signed in as:
            <div className="font-medium">{user?.displayName || user?.email}</div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full bg-red-600 text-white py-2 rounded"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
