// src/pages/ProductDetails.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../services/firebase"; // ensure auth is exported from your firebase file
import { addTransferEvent, getTransfers } from "../services/traceService";
import Timeline from "../components/Timeline";
import TransferForm from "../components/TransferForm";

export default function ProductDetails() {
  const { id } = useParams(); // productId from route
  const [product, setProduct] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);

  const productRef = useMemo(() => doc(db, "products", id), [id]);

  // load product + transfers
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const snap = await getDoc(productRef);
        if (!cancelled) {
          if (snap.exists()) setProduct({ id: snap.id, ...snap.data() });
          else setProduct(null);
        }

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

  // handler to add a transfer event
  const handleAddEvent = async ({ from, to, note, location }) => {
    setAdding(true);
    setError(null);
    try {
      const createdBy = auth?.currentUser?.uid || null;
      await addTransferEvent(id, { from, to, note, location, createdBy });
      // refresh list
      const list = await getTransfers(id);
      setEvents(list);
    } catch (err) {
      console.error("Failed to add transfer event:", err);
      setError("Failed to add transfer event. Try again.");
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="p-6">Loading…</div>;
  if (!product) return <div className="p-6">Product not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 grid gap-6">
      <div className="bg-white p-4 rounded-xl shadow">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            {product.description && (
              <p className="text-gray-700 mt-2">{product.description}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">ID: {product.id}</p>
            {product.batchNo && (
              <p className="text-xs text-gray-500 mt-1">Batch: {product.batchNo}</p>
            )}
          </div>

          {product.imageUrl && (
            <div className="w-40 h-40 border rounded p-2 flex items-center justify-center bg-white">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="max-h-36 object-contain"
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-3">Add Transfer</h2>
          <TransferForm
            defaultFrom={product.company || product.name || ""}
            onSubmit={handleAddEvent}
            withGeo={true}
          />
          {adding && <p className="text-sm text-gray-500 mt-2">Saving transfer...</p>}
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-3">Product Journey</h2>
          <Timeline items={events} />
        </div>
      </div>
    </div>
  );
}
