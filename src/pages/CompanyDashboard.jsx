// src/dashboards/CompanyDashboard.jsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "../pages/DashboardLayout";
import ProductForm from "../components/ProductForm";
import QRCodeDisplay from "../components/QRCodeDisplay";
import { db, auth } from "../services/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import ProductDetails from "../components/ProductDetails";
import {
  CubeIcon,
  CheckCircleIcon,
  QrCodeIcon,
  PlusIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  EyeIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";

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
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    qrScans: 0
  });

  useEffect(() => {
    if (!auth.currentUser) return;
    
    // Get product count
    const q = query(
      collection(db, "products"),
      where("createdBy", "==", auth.currentUser.uid)
    );
    
    const unsub = onSnapshot(q, (snap) => {
      const products = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setStats({
        totalProducts: products.length,
        activeProducts: products.filter(p => p.status !== 'inactive').length,
        qrScans: products.reduce((sum, p) => sum + (p.scanCount || 0), 0)
      });
    });
    
    return () => unsub();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Company Overview</h1>
        <div className="text-sm text-gray-500">Last updated: Just now</div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-100">
              <CubeIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-900">{stats.totalProducts}</h2>
              <p className="text-sm text-gray-600">Total Products</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-green-100">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-900">{stats.activeProducts}</h2>
              <p className="text-sm text-gray-600">Active Products</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-purple-100">
              <QrCodeIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-900">{stats.qrScans}</h2>
              <p className="text-sm text-gray-600">Total Scans</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link 
            to="add-product" 
            className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Product 
          </Link>
          <Link 
            to="products" 
            className="flex items-center justify-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            View All Products
          </Link>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ChartBarIcon className="h-5 w-5 mr-2 text-indigo-600" />
          Recent Activity
        </h2>
        <div className="text-center py-8 text-gray-500">
          <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2">No recent activity</p>
          <p className="text-sm">Your product activities will appear here</p>
        </div>
      </div>
    </div>
  );
}

function CompanyAddProduct() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <PlusIcon className="h-6 w-6 mr-2 text-indigo-600" />
          Add New Product
        </h1>
        <ProductForm />
      </div>
    </div>
  );
}

function CompanyProducts() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const navigate = useNavigate();

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

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.batchNo && product.batchNo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleViewDetails = (productId) => {
    navigate(`/company/product/${productId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
        <Link 
          to="../add-product" 
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Product
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products by name or batch..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
              <FunnelIcon className="h-4 w-4 mr-1" />
              Filter
            </button>
            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
              <ArrowsUpDownIcon className="h-4 w-4 mr-1" />
              Sort
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Products Table */}
        <div className="lg:flex-1">
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Batch
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Scans
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500 sm:hidden">{product.batchNo || "-"}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                        {product.batchNo || "-"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {product.scanCount || 0}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => {
                              setSelectedProductId(product.id);
                              setIsQrModalOpen(true);
                            }} 
                            className="text-indigo-600 hover:text-indigo-900 p-1"
                            title="View QR Code"
                          >
                            <QrCodeIcon className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => handleViewDetails(product.id)} 
                            className="text-gray-600 hover:text-gray-900 p-1"
                            title="View Details"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4">No products found</p>
                <p className="text-sm">Get started by adding your first product</p>
                <Link 
                  to="../add-product" 
                  className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Product
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* QR Code Preview - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:block lg:w-80">
          <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <QrCodeIcon className="h-5 w-5 mr-2 text-indigo-600" />
              QR Code Preview
            </h3>
            {selectedProductId ? (
              <div className="text-center">
                <QRCodeDisplay productId={selectedProductId} />
                <p className="text-sm text-gray-500 mt-3">Scan this code to verify product authenticity</p>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <QrCodeIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4">Select a product to view its QR code</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile QR Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 lg:hidden">
          <div className="bg-white rounded-lg max-w-sm w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">QR Code</h3>
              <button 
                onClick={() => setIsQrModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {selectedProductId && (
              <div className="text-center">
                <QRCodeDisplay productId={selectedProductId} />
                <p className="text-sm text-gray-500 mt-3">Scan this code to verify product authenticity</p>
                <button 
                  onClick={() => handleViewDetails(selectedProductId)}
                  className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                >
                  View Product Details
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}