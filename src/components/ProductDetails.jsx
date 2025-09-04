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
  TruckIcon,
  ArrowLeftIcon,
  ShareIcon
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
  const [activeTab, setActiveTab] = useState("details"); // details, batches, journey

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this product: ${product.name}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
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
      <div className="max-w-5xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Product not found</h3>
          <p className="mt-2 text-sm text-gray-500">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      {/* Mobile Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4 flex items-center justify-between lg:hidden">
        <button 
          onClick={() => window.history.back()} 
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900 truncate px-2">{product.name}</h1>
        <button 
          onClick={handleShare}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ShareIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Product Details</h1>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            ID: {product.id.substring(0, 8)}...
          </span>
          <button 
            onClick={handleShare}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ShareIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Tabs */}
      <div className="bg-white rounded-lg shadow-sm border p-1 flex lg:hidden">
        <button
          onClick={() => setActiveTab("details")}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md ${activeTab === "details" ? "bg-indigo-100 text-indigo-700" : "text-gray-600"}`}
        >
          Details
        </button>
        <button
          onClick={() => setActiveTab("batches")}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md ${activeTab === "batches" ? "bg-indigo-100 text-indigo-700" : "text-gray-600"}`}
        >
          Batches
        </button>
        <button
          onClick={() => setActiveTab("journey")}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md ${activeTab === "journey" ? "bg-indigo-100 text-indigo-700" : "text-gray-600"}`}
        >
          Journey
        </button>
      </div>

      {/* Product Info - Always visible on desktop, tabbed on mobile */}
      <div className={`${activeTab === "details" ? "block" : "hidden"} lg:block`}>
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6">
            {product.imageUrl && (
              <div className="flex justify-center md:justify-start">
                <div className="w-32 h-32 md:w-40 md:h-40 border rounded-lg p-2 flex items-center justify-center bg-gray-50">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="max-h-full object-contain"
                  />
                </div>
              </div>
            )}

            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">{product.name}</h1>
              <div className="mt-1 md:mt-2 flex items-center">
                <TagIcon className="h-4 w-4 md:h-5 md:w-5 text-gray-400 mr-1 md:mr-2" />
                <span className="text-xs md:text-sm text-gray-600">{product.category}</span>
              </div>
              
              {product.description && (
                <div className="mt-3 md:mt-4">
                  <h3 className="text-sm font-medium text-gray-700">Description</h3>
                  <p className="mt-1 text-sm md:text-base text-gray-600">{product.description}</p>
                </div>
              )}
              
              <div className="mt-3 md:mt-4 flex items-center">
                <CurrencyRupeeIcon className="h-4 w-4 md:h-5 md:w-5 text-gray-400 mr-1" />
                <span className="text-lg md:text-xl font-semibold text-gray-900">₹{product.basePrice}</span>
                <span className="ml-2 text-xs md:text-sm text-gray-500">Base Price</span>
              </div>
            </div>
          </div>
        </div>

        {/* Company Info */}
        {company && (
          <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6 mt-4">
            <h2 className="text-lg font-medium text-gray-900 flex items-center mb-3 md:mb-4">
              <BuildingStorefrontIcon className="h-5 w-5 mr-2 text-indigo-600" />
              Company Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-700">Name</p>
                <p className="mt-1 text-sm md:text-base text-gray-900">{company.name}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-700">Contact</p>
                <p className="mt-1 text-sm md:text-base text-gray-900">{company.contact}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs md:text-sm font-medium text-gray-700">Address</p>
                <p className="mt-1 text-sm md:text-base text-gray-900">{company.address}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Batches - Tabbed on mobile */}
      <div className={`${activeTab === "batches" ? "block" : "hidden"} lg:block`}>
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="p-4 md:p-6">
            <h2 className="text-lg font-medium text-gray-900 flex items-center mb-3 md:mb-4">
              <DocumentTextIcon className="h-5 w-5 mr-2 text-indigo-600" />
              Batches
            </h2>
            {batches.length ? (
              <>
                {/* Mobile view - card layout */}
                <div className="lg:hidden space-y-4">
                  {batches.map((b) => (
                    <div key={b.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-medium text-gray-500">Batch Number</p>
                          <p className="text-sm font-medium text-gray-900">{b.batchNumber}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">Stock</p>
                          <p className="text-sm text-gray-900">{b.stock}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">MFG Date</p>
                          <p className="text-sm text-gray-900">{b.mfgDate}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">EXP Date</p>
                          <p className="text-sm text-gray-900">{b.expDate}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-xs font-medium text-gray-500">Price</p>
                          <div className="flex items-center">
                            <CurrencyRupeeIcon className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-900">{b.price}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop view - table */}
                <div className="hidden lg:block overflow-x-auto">
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
              </>
            ) : (
              <div className="text-center py-6 md:py-8 text-gray-500">
                <DocumentTextIcon className="mx-auto h-10 w-10 md:h-12 md:w-12 text-gray-400" />
                <p className="mt-2 text-sm md:text-base">No batches available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transfer + Journey - Tabbed on mobile */}
      <div className={`${activeTab === "journey" ? "block" : "hidden"} lg:block`}>
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {(role === "company" || role === "retailer") && (
            <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
              <h2 className="text-lg font-medium text-gray-900 flex items-center mb-3 md:mb-4">
                <TruckIcon className="h-5 w-5 mr-2 text-indigo-600" />
                Add Transfer
              </h2>
              <TransferForm
                defaultFrom={product.company || product.name || ""}
                onSubmit={handleAddEvent}
                withGeo={true}
              />
              {adding && (
                <div className="mt-3 md:mt-4 flex items-center text-sm text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Saving transfer...
                </div>
              )}
              {error && (
                <div className="mt-3 md:mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
            <h2 className="text-lg font-medium text-gray-900 flex items-center mb-3 md:mb-4">
              <TruckIcon className="h-5 w-5 mr-2 text-indigo-600" />
              Product Journey
            </h2>
            <Timeline items={events} />
          </div>
        </div>
      </div>
    </div>
  );
}