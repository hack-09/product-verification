// src/dashboards/CustomerDashboard.jsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "../pages/DashboardLayout";
import QRScanner from "../components/QRScanner";
import VerifyProduct from "../pages/VerifyProduct";
import { Routes, Route, Link } from "react-router-dom";
import { db, auth } from "../services/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

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
    <div>
      <h1 className="text-2xl font-bold">Customer Portal</h1>
      <p className="mt-2 text-gray-600">Scan products to check authenticity and view details.</p>
      <div className="mt-4 flex gap-3">
        <Link to="scan" className="bg-blue-600 text-white px-4 py-2 rounded">Scan Product</Link>
        <Link to="history" className="bg-gray-200 px-4 py-2 rounded">My Verifications</Link>
      </div>
    </div>
  );
}

function CustomerHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, "verifications"), where("verifiedByUid", "==", auth.currentUser.uid));
    const unsub = onSnapshot(q, snap => setHistory(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Verifications</h1>
      {history.length === 0 ? <div className="text-gray-500">No verifications yet.</div> : (
        <ul className="space-y-2">
          {history.map(h => (
            <li key={h.id} className="p-3 bg-white rounded shadow">
              <div><strong>Product:</strong> {h.productId}</div>
              <div className="text-sm text-gray-500">{new Date(h.verifiedAt?.seconds ? h.verifiedAt.seconds * 1000 : h.verifiedAt).toLocaleString()}</div>
              <div><strong>Result:</strong> {h.status}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
