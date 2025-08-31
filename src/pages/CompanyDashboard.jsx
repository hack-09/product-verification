// src/dashboards/CompanyDashboard.jsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "../pages/DashboardLayout";
import ProductForm from "../components/ProductForm";
import QRCodeDisplay from "../components/QRCodeDisplay";
import { db, auth } from "../services/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Link, Routes, Route } from "react-router-dom";
import ProductDetails from "../components/ProductDetails";

export default function CompanyDashboard() {
  return (
    <DashboardLayout role="company">
      <Routes>
        <Route index element={<CompanyHome />} />
        <Route path="add-product" element={<CompanyAddProduct />} />
        <Route path="products" element={<CompanyProducts />} />
        <Route path="product/:id" element={<ProductDetails />} />
      </Routes>
    </DashboardLayout>
  );
}

function CompanyHome() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Company Overview</h1>
      <p className="mt-2 text-gray-600">Quick actions for product management.</p>
      <div className="mt-4 flex gap-3">
        <Link to="add-product" className="bg-blue-600 text-white px-4 py-2 rounded">Add Product</Link>
        <Link to="products" className="bg-gray-200 px-4 py-2 rounded">View Products</Link>
      </div>
    </div>
  );
}

function CompanyAddProduct() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>
      <ProductForm />
    </div>
  );
}

function CompanyProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(
      collection(db, "products"),
      where("createdBy", "==", auth.currentUser.uid)
    );
    const unsub = onSnapshot(q, (snap) => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const [selectedProductId, setSelectedProductId] = useState(null);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Products</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Batch</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">{p.batchNo || "-"}</td>
                  <td className="p-2 space-x-2">
                    <button onClick={() => setSelectedProductId(p.id)} className="bg-green-600 text-white px-2 py-1 rounded">Show QR</button>
                    <Link to={`product/${p.id}`} className="bg-blue-600 text-white px-2 py-1 rounded">Details</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-3">QR Preview</h3>
          {selectedProductId ? (
            <QRCodeDisplay productId={selectedProductId} />
          ) : (
            <div className="text-gray-500">Select a product to view its QR.</div>
          )}
        </div>
      </div>
    </div>
  );
}
