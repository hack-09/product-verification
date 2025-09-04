// src/dashboards/CustomerDashboard.jsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "../pages/DashboardLayout";
import VerifyProduct from "../pages/VerifyProduct";
import { Routes, Route, Link } from "react-router-dom";
import { db, auth } from "../services/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { 
  QrCodeIcon, 
  ClockIcon, 
  CheckBadgeIcon, 
  XCircleIcon,
  ArrowTopRightOnSquareIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";

export default function CustomerDashboard() {
  return (
    <DashboardLayout role="customer">
      <Routes>
        <Route index element={<CustomerHome />} />
        <Route path="scan" element={<VerifyProduct />} />
        <Route path="history" element={<CustomerHistory />} />
      </Routes>
    </DashboardLayout>
  );
}

function CustomerHome() {
  const [stats, setStats] = useState({
    authentic: 0,
    counterfeit: 0,
    total: 0
  });

  useEffect(() => {
    if (!auth.currentUser) return;
    
    const q = query(
      collection(db, "verifications"), 
      where("verifiedByUid", "==", auth.currentUser.uid)
    );
    
    const unsub = onSnapshot(q, (snap) => {
      const historyData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      
      const authentic = historyData.filter(h => h.status === "authentic").length;
      const counterfeit = historyData.filter(h => h.status === "counterfeit").length;
      
      setStats({
        authentic,
        counterfeit,
        total: historyData.length
      });
    });
    
    return () => unsub();
  }, []);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customer Dashboard</h1>
        <p className="mt-1 text-gray-600">Verify product authenticity and track your verification history</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Scan Card */}
        <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
          <div className="flex items-center mb-3 md:mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <QrCodeIcon className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
            </div>
            <h2 className="ml-3 text-base md:text-lg font-medium text-gray-900">Scan Product</h2>
          </div>
          <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
            Verify the authenticity of products by scanning their QR codes.
          </p>
          <Link 
            to="scan" 
            className="inline-flex items-center px-3 py-2 md:px-4 md:py-2 border border-transparent text-sm md:text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Scan Now
          </Link>
        </div>

        {/* History Card */}
        <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
          <div className="flex items-center mb-3 md:mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ClockIcon className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
            </div>
            <h2 className="ml-3 text-base md:text-lg font-medium text-gray-900">Verification History</h2>
          </div>
          <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
            View your past product verifications and their results.
          </p>
          <Link 
            to="history" 
            className="inline-flex items-center px-3 py-2 md:px-4 md:py-2 border border-gray-300 text-sm md:text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View History
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 md:mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-3 md:mb-4 flex items-center">
          <ChartBarIcon className="h-5 w-5 mr-2 text-indigo-600" />
          Verification Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          <div className="bg-white rounded-lg shadow-sm border p-3 md:p-4">
            <div className="flex items-center">
              <div className="p-1 md:p-2 bg-green-100 rounded-lg">
                <CheckBadgeIcon className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
              </div>
              <div className="ml-2 md:ml-3">
                <p className="text-xs md:text-sm font-medium text-gray-600">Authentic</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{stats.authentic}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-3 md:p-4">
            <div className="flex items-center">
              <div className="p-1 md:p-2 bg-red-100 rounded-lg">
                <XCircleIcon className="h-4 w-4 md:h-5 md:w-5 text-red-600" />
              </div>
              <div className="ml-2 md:ml-3">
                <p className="text-xs md:text-sm font-medium text-gray-600">Counterfeit</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{stats.counterfeit}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-3 md:p-4">
            <div className="flex items-center">
              <div className="p-1 md:p-2 bg-blue-100 rounded-lg">
                <ClockIcon className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
              </div>
              <div className="ml-2 md:ml-3">
                <p className="text-xs md:text-sm font-medium text-gray-600">Total Scans</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="mt-6 md:mt-8 bg-white rounded-lg shadow-sm border p-4 md:p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-3 md:mb-4">Recent Verifications</h2>
        <div className="text-center py-4 md:py-8 text-gray-500">
          <ClockIcon className="mx-auto h-8 w-8 md:h-12 md:w-12 text-gray-400" />
          <p className="mt-2 text-sm md:text-base">No recent verifications</p>
          <p className="text-xs md:text-sm">Your verification history will appear here</p>
        </div>
      </div>
    </div>
  );
}

function CustomerHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, authentic, counterfeit

  useEffect(() => {
    if (!auth.currentUser) return;
    
    setLoading(true);
    const q = query(
      collection(db, "verifications"), 
      where("verifiedByUid", "==", auth.currentUser.uid)
    );
    
    const unsub = onSnapshot(q, (snap) => {
      const historyData = snap.docs.map(d => ({ 
        id: d.id, 
        ...d.data(),
        date: d.data().verifiedAt?.seconds 
          ? new Date(d.data().verifiedAt.seconds * 1000)
          : new Date(d.data().verifiedAt)
      }));
      
      // Sort by date, newest first
      historyData.sort((a, b) => b.date - a.date);
      setHistory(historyData);
      setLoading(false);
    });
    
    return () => unsub();
  }, []);

  // Filter history based on selection
  const filteredHistory = filter === "all" 
    ? history 
    : history.filter(item => item.status === filter);

  const getStatusIcon = (status) => {
    if (status === "authentic") {
      return <CheckBadgeIcon className="h-5 w-5 text-green-500" />;
    } else {
      return <XCircleIcon className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusClass = (status) => {
    if (status === "authentic") {
      return "bg-green-100 text-green-800";
    } else {
      return "bg-red-100 text-red-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Verification History</h1>
        <p className="mt-1 text-sm md:text-base text-gray-600">Your past product verification results</p>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-3 md:p-4 mb-4 md:mb-6">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 mr-2">Filter:</span>
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 text-xs md:text-sm rounded-full ${filter === "all" ? "bg-indigo-100 text-indigo-800" : "bg-gray-100 text-gray-700"}`}
          >
            All ({history.length})
          </button>
          <button
            onClick={() => setFilter("authentic")}
            className={`px-3 py-1 text-xs md:text-sm rounded-full ${filter === "authentic" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}`}
          >
            Authentic ({history.filter(h => h.status === "authentic").length})
          </button>
          <button
            onClick={() => setFilter("counterfeit")}
            className={`px-3 py-1 text-xs md:text-sm rounded-full ${filter === "counterfeit" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-700"}`}
          >
            Counterfeit ({history.filter(h => h.status === "counterfeit").length})
          </button>
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="text-center py-8 md:py-12 bg-white rounded-lg shadow-sm border">
          <ClockIcon className="mx-auto h-10 w-10 md:h-12 md:w-12 text-gray-400" />
          <h3 className="mt-2 text-sm md:text-base font-medium text-gray-900">
            {filter === "all" ? "No verifications yet" : `No ${filter} verifications`}
          </h3>
          <p className="mt-1 text-xs md:text-sm text-gray-500">
            {filter === "all" 
              ? "Get started by scanning your first product." 
              : `You haven't found any ${filter} products yet.`}
          </p>
          <div className="mt-4 md:mt-6">
            <Link
              to="scan"
              className="inline-flex items-center px-4 py-2 border border-transparent text-xs md:text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <QrCodeIcon className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
              Scan Product
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {filteredHistory.map((h) => (
              <li key={h.id} className="p-4 md:p-6 hover:bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start">
                    {getStatusIcon(h.status)}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        Product #{h.productId?.substring(0, 8)}...
                      </p>
                      <p className="text-xs md:text-sm text-gray-500 mt-1">
                        {h.date.toLocaleDateString()} at {h.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-0 sm:ml-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(h.status)}`}>
                      {h.status === "authentic" ? "Authentic" : "Counterfeit"}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}