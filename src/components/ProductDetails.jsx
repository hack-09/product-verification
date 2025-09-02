// src/pages/ProductDetails.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db, auth } from "../services/firebase";
import { addTransferEvent, getTransfers } from "../services/traceService";
import Timeline from "../components/Timeline";
import TransferForm from "../components/TransferForm";
import {
  CubeIcon,
  BuildingStorefrontIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  TagIcon,
  DocumentTextIcon,
  TruckIcon
} from "@heroicons/react/24/outline";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [company, setCompany] = useState(null);
  const [batches, setBatches] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);

  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const role = authUser?.role;

  const productRef = useMemo(() => doc(db, "products", id), [id]);

  // load product + company + batches + transfers
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        // fetch product
        const snap = await getDoc(productRef);
        if (!snap.exists()) {
          if (!cancelled) setProduct(null);
          return;
        }

        const prod = { id: snap.id, ...snap.data() };
        if (!cancelled) setProduct(prod);

        // fetch company details
        if (prod.companyId) {
          const companySnap = await getDoc(doc(db, "companies", prod.companyId));
          if (companySnap.exists() && !cancelled) {
            setCompany({ id: companySnap.id, ...companySnap.data() });
          }
        }

        // fetch batches
        const batchSnap = await getDocs(collection(db, "products", id, "batches"));
        if (!cancelled) {
          setBatches(batchSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        }

        // fetch transfer history
        const list = await getTransfers(id);
        if (!cancelled) setEvents(list);

      } catch (err) {
        console.error("Failed to load product details:", err);
        if (!cancelled) setError("Failed to load product details.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id, productRef]);

  const handleAddEvent = async ({ from, to, note, location }) => {
    setAdding(true);
    setError(null);
    try {
      const createdBy = auth?.currentUser?.uid || null;
      await addTransferEvent(id, { from, to, note, location, createdBy });
      const list = await getTransfers(id);
      setEvents(list);
    } catch (err) {
      console.error("Failed to add transfer event:", err);
      setError("Failed to add transfer event. Try again.");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Product not found</h3>
          <p className="mt-2 text-sm text-gray-500">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Product Details</h1>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          ID: {product.id.substring(0, 8)}...
        </span>
      </div>

      {/* Product Info */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row gap-6">
          {product.imageUrl && (
            <div className="flex-shrink-0">
              <div className="w-40 h-40 border rounded-lg p-2 flex items-center justify-center bg-gray-50">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="max-h-36 object-contain"
                />
              </div>
            </div>
          )}

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <div className="mt-2 flex items-center">
              <TagIcon className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">{product.category}</span>
            </div>
            
            {product.description && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700">Description</h3>
                <p className="mt-1 text-gray-600">{product.description}</p>
              </div>
            )}
            
            <div className="mt-4 flex items-center">
              <CurrencyRupeeIcon className="h-5 w-5 text-gray-400 mr-1" />
              <span className="text-lg font-semibold text-gray-900">₹{product.basePrice}</span>
              <span className="ml-2 text-sm text-gray-500">Base Price</span>
            </div>
          </div>
        </div>
      </div>

      {/* Company Info */}
      {company && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-medium text-gray-900 flex items-center mb-4">
            <BuildingStorefrontIcon className="h-5 w-5 mr-2 text-indigo-600" />
            Company Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Name</p>
              <p className="mt-1 text-gray-900">{company.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Contact</p>
              <p className="mt-1 text-gray-900">{company.contact}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-gray-700">Address</p>
              <p className="mt-1 text-gray-900">{company.address}</p>
            </div>
          </div>
        </div>
      )}

      {/* Batches */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 flex items-center mb-4">
            <DocumentTextIcon className="h-5 w-5 mr-2 text-indigo-600" />
            Batches
          </h2>
          {batches.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Batch Number
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      MFG Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      EXP Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {batches.map((b) => (
                    <tr key={b.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {b.batchNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {b.stock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {b.mfgDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {b.expDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <CurrencyRupeeIcon className="h-4 w-4 text-gray-400 mr-1" />
                          {b.price}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2">No batches available</p>
            </div>
          )}
        </div>
      </div>

      {/* Transfer + Journey */}
      <div className="grid md:grid-cols-2 gap-6">
        {(role === "company" || role === "retailer") && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-medium text-gray-900 flex items-center mb-4">
              <TruckIcon className="h-5 w-5 mr-2 text-indigo-600" />
              Add Transfer
            </h2>
            <TransferForm
              defaultFrom={product.company || product.name || ""}
              onSubmit={handleAddEvent}
              withGeo={true}
            />
            {adding && (
              <div className="mt-4 flex items-center text-sm text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Saving transfer...
              </div>
            )}
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-medium text-gray-900 flex items-center mb-4">
            <TruckIcon className="h-5 w-5 mr-2 text-indigo-600" />
            Product Journey
          </h2>
          <Timeline items={events} />
        </div>
      </div>
    </div>
  );
}