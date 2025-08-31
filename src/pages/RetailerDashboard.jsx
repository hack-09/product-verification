// src/dashboards/RetailerDashboard.jsx
import React, { useState, useEffect } from "react";
import DashboardLayout from "../pages/DashboardLayout";
import QRScanner from "../components/QRScanner";
import VerifyProduct from "../pages/VerifyProduct";
import { db, auth } from "../services/firebase";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { Routes, Route, Link } from "react-router-dom";

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
    <div>
      <h1 className="text-2xl font-bold">Retailer Dashboard</h1>
      <p className="mt-2 text-gray-600">Quick actions for scanning & verifying products.</p>
      <div className="mt-4 flex gap-3">
        <Link to="scan" className="bg-blue-600 text-white px-4 py-2 rounded">Scan Product</Link>
        <Link to="history" className="bg-gray-200 px-4 py-2 rounded">Scan History</Link>
      </div>
    </div>
  );
}

function RetailerScan() {
  // QRScanner calls Verify internally in your components, but we also allow manual code view
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Scan & Verify</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <div><QRScanner /></div>
        <div><VerifyProduct /></div>
      </div>
    </div>
  );
}

function RetailerHistory() {
  const [scans, setScans] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, "verifications"), where("verifiedBy", "==", auth.currentUser.uid));
    const unsub = onSnapshot(q, snap => setScans(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Scan History</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-2 border">Product ID</th>
            <th className="p-2 border">Time</th>
            <th className="p-2 border">Result</th>
          </tr>
        </thead>
        <tbody>
          {scans.map(s => (
            <tr key={s.id} className="border-t">
              <td className="p-2">{s.productId}</td>
              <td className="p-2">{new Date(s.verifiedAt?.seconds ? s.verifiedAt.seconds * 1000 : s.verifiedAt).toLocaleString()}</td>
              <td className="p-2">{s.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
