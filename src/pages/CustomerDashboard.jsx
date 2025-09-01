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
  ArrowTopRightOnSquareIcon
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
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customer Dashboard</h1>
        <p className="mt-1 text-gray-600">Verify product authenticity and track your verification history</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scan Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <QrCodeIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="ml-3 text-lg font-medium text-gray-900">Scan Product</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Verify the authenticity of products by scanning their QR codes.
          </p>
          <Link 
            to="scan" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Scan Now
          </Link>
        </div>

        {/* History Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="ml-3 text-lg font-medium text-gray-900">Verification History</h2>
          </div>
          <p className="text-gray-600 mb-4">
            View your past product verifications and their results.
          </p>
          <Link 
            to="history" 
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View History
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Verification Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckBadgeIcon className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Authentic Products</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircleIcon className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Counterfeit Detected</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ClockIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Scans</p>
                <p className="text-2xl font-bold text-gray-900">14</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomerHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Verification History</h1>
        <p className="mt-1 text-gray-600">Your past product verification results</p>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-12">
          <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No verifications yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by scanning your first product.</p>
          <div className="mt-6">
            <Link
              to="scan"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <QrCodeIcon className="h-5 w-5 mr-2" />
              Scan Product
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {history.map((h) => (
              <li key={h.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getStatusIcon(h.status)}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        Product #{h.productId?.substring(0, 8)}...
                      </p>
                      <p className="text-sm text-gray-500">
                        {h.date.toLocaleDateString()} at {h.date.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(h.status)}`}>
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