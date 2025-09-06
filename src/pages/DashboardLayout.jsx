// src/components/DashboardLayout.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Footer from "../components/Footer";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  PlusCircleIcon,
  CubeIcon,
  QrCodeIcon,
  ClockIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon
} from "@heroicons/react/24/outline";

export default function DashboardLayout({ children, role }) {
  const { user, signOutUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      // On mobile, always start with sidebar closed
      if (mobile) {
        setIsSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSignOut = async () => {
    localStorage.removeItem("authUser");
    await signOutUser();
    navigate("/");
  };

  // Sidebar links vary by role with Heroicons
  const sidebarLinks = {
    company: [
      { to: "/company", label: "Overview", icon: <HomeIcon className="h-5 w-5" /> },
      { to: "/company/add-product", label: "Add Product", icon: <PlusCircleIcon className="h-5 w-5" /> },
      { to: "/company/products", label: "Products", icon: <CubeIcon className="h-5 w-5" /> },
    ],
    retailer: [
      { to: "/retailer", label: "Overview", icon: <HomeIcon className="h-5 w-5" /> },
      { to: "/retailer/scan", label: "Scan", icon: <QrCodeIcon className="h-5 w-5" /> },
      { to: "/retailer/history", label: "History", icon: <ClockIcon className="h-5 w-5" /> },
    ],
    customer: [
      { to: "/customer", label: "Overview", icon: <HomeIcon className="h-5 w-5" /> },
      { to: "/customer/scan", label: "Scan", icon: <QrCodeIcon className="h-5 w-5" /> },
      { to: "/customer/history", label: "History", icon: <ClockIcon className="h-5 w-5" /> },
    ],
  };

  // Get current role links or default to customer
  const currentLinks = sidebarLinks[role] || sidebarLinks.customer;

  // Determine the current page for active styling
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  // Toggle sidebar based on device
  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  // Close mobile sidebar when a link is clicked
  const handleLinkClick = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-200">
      {/* Mobile sidebar overlay */}
      {isMobile && isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div 
        className={`
          bg-indigo-800 dark:bg-gray-800 text-white transition-all duration-300 flex flex-col
          fixed lg:relative inset-y-0 left-0 z-50
          ${isMobile ? (
            isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          ) : (
            isSidebarCollapsed ? "w-16" : "w-52"
          )}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Brand section */}
          <div className="flex items-center justify-between h-14 px-4 bg-indigo-900 dark:bg-gray-900">
            {(!isSidebarCollapsed || isMobile) && (
              <h1 className="text-lg font-bold flex items-center">
                <span className="bg-white text-indigo-800 dark:bg-gray-700 dark:text-white rounded-md p-1 mr-2">
                  <CubeIcon className="h-5 w-5" />
                </span>
                TrueCheck
              </h1>
            )}
            <button
              onClick={toggleSidebar}
              className="p-1 rounded hover:bg-indigo-700 dark:hover:bg-gray-700"
            >
              {isMobile ? (
                <XMarkIcon className="h-5 w-5" />
              ) : isSidebarCollapsed ? (
                <ChevronRightIcon className="h-5 w-5" />
              ) : (
                <ChevronLeftIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* User info - only show when expanded */}
          {(!isSidebarCollapsed || isMobile) && (
            <div className="p-3 border-b border-indigo-700 dark:border-gray-700">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-indigo-600 dark:bg-gray-700 flex items-center justify-center text-white font-semibold text-sm">
                  {user?.displayName
                    ? user.displayName.charAt(0).toUpperCase()
                    : user?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="ml-2 truncate">
                  <p className="text-xs font-medium truncate">
                    {user?.displayName || user?.email}
                  </p>
                  <p className="text-xs text-indigo-200 dark:text-gray-300 capitalize">{role}</p>
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
                  onClick={handleLinkClick}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActiveLink(link.to)
                      ? "bg-indigo-900 dark:bg-gray-700 text-white"
                      : "text-indigo-100 dark:text-gray-300 hover:bg-indigo-700 dark:hover:bg-gray-700"
                  }`}
                  title={isSidebarCollapsed && !isMobile ? link.label : ""}
                >
                  {link.icon}
                  {(!isSidebarCollapsed || isMobile) && (
                    <span className="ml-3">{link.label}</span>
                  )}
                </Link>
              ))}
            </div>

            {/* Theme Toggle */}
            <div className="mt-4 p-3 border-t border-indigo-700 dark:border-gray-700">
              <button
                onClick={toggleTheme}
                className={`flex items-center w-full px-3 py-2 text-sm font-medium text-indigo-100 dark:text-gray-300 bg-indigo-700 dark:bg-gray-700 rounded-md hover:bg-indigo-600 dark:hover:bg-gray-600 transition-colors ${
                  (isSidebarCollapsed && !isMobile) ? "justify-center" : ""
                }`}
                title={(isSidebarCollapsed && !isMobile) ? "Toggle theme" : ""}
              >
                {theme === 'light' ? (
                  <MoonIcon className="h-5 w-5" />
                ) : (
                  <SunIcon className="h-5 w-5" />
                )}
                {(!isSidebarCollapsed || isMobile) && (
                  <span className="ml-2">
                    {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                  </span>
                )}
              </button>
            </div>

            {/* Sign out button */}
            <div className="p-3 border-t border-indigo-700 dark:border-gray-700">
              <button
                onClick={handleSignOut}
                className={`flex items-center w-full px-3 py-2 text-sm font-medium text-white bg-indigo-600 dark:bg-red-600 rounded-md hover:bg-indigo-500 dark:hover:bg-red-500 transition-colors ${
                  (isSidebarCollapsed && !isMobile) ? "justify-center" : ""
                }`}
                title={(isSidebarCollapsed && !isMobile) ? "Sign out" : ""}
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                {(!isSidebarCollapsed || isMobile) && (
                  <span className="ml-2">Sign out</span>
                )}
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Top header bar */}
        <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 h-14 flex items-center justify-between px-4 shadow-sm">
          <div className="flex items-center">
            <button
              className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 mr-2"
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              {currentLinks.find(link => isActiveLink(link.to))?.label || "Dashboard"}
            </h2>
          </div>
          
          {/* User avatar for mobile */}
          <div className="lg:hidden">
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
              {user?.displayName
                ? user.displayName.charAt(0).toUpperCase()
                : user?.email?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-1">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}