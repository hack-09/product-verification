// src/dashboards/RetailerDashboard.jsx
import React, { useState, useEffect } from "react";
import DashboardLayout from "../pages/DashboardLayout";
import VerifyProduct from "../pages/VerifyProduct";
import { db, auth } from "../services/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Routes, Route, Link } from "react-router-dom";
import {
  QrCodeIcon,
  ClockIcon,
  CheckBadgeIcon,
  XCircleIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";

export default function RetailerDashboard() {
  return (
    <DashboardLayout role="retailer">
      <Routes>
        <Route index element={<RetailerHome />} />
        <Route path="scan" element={<RetailerScan />} />
        <Route path="history" element={<RetailerHistory />} />
      </Routes>
    </DashboardLayout>
  );
}

function RetailerHome() {
  return (
    <div className="space-y-6 m-5">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Retailer Dashboard</h1>
        <p className="mt-1 text-gray-600">Quick actions for scanning & verifying products</p>
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
            Verify product authenticity by scanning QR codes at your retail location.
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
            <h2 className="ml-3 text-lg font-medium text-gray-900">Scan History</h2>
          </div>
          <p className="text-gray-600 mb-4">
            View your past product verification scans and their results.
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <QrCodeIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Scans</p>
                <p className="text-2xl font-bold text-gray-900">142</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckBadgeIcon className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Authentic</p>
                <p className="text-2xl font-bold text-gray-900">128</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircleIcon className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Counterfeit</p>
                <p className="text-2xl font-bold text-gray-900">14</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ChartBarIcon className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">90%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Scans</h2>
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <p className="text-sm text-gray-500">You haven't performed any scans yet.</p>
            <Link 
              to="scan" 
              className="inline-block mt-2 text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Scan your first product
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function RetailerScan() {
  return (
    <div className="m-5 space-y-6">
      <VerifyProduct />
    </div>
  );
}

function RetailerHistory() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;
    
    setLoading(true);
    const q = query(
      collection(db, "verifications"), 
      where("verifiedBy", "==", auth.currentUser.uid)
    );
    
    const unsub = onSnapshot(q, (snap) => {
      const scanData = snap.docs.map(d => ({ 
        id: d.id, 
        ...d.data(),
        date: d.data().verifiedAt?.seconds 
          ? new Date(d.data().verifiedAt.seconds * 1000)
          : new Date(d.data().verifiedAt)
      }));
      
      // Sort by date, newest first
      scanData.sort((a, b) => b.date - a.date);
      setScans(scanData);
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
        <h1 className="text-2xl font-bold text-gray-900">Scan History</h1>
        <p className="mt-1 text-gray-600">Your past product verification scans</p>
      </div>

      {scans.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No scans yet</h3>
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
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {scans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(scan.status)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {scan.productId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{scan.date.toLocaleDateString()}</div>
                      <div className="text-sm text-gray-500">{scan.date.toLocaleTimeString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(scan.status)}`}>
                        {scan.status === "authentic" ? "Authentic" : "Counterfeit"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}