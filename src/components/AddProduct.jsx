import React, { useState, useRef } from "react";
import { db } from "../services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import QRCode from "react-qr-code";
import { toPng } from "html-to-image";

export default function AddProduct({ currentUser }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [productId, setProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const qrRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return setError("Product name is required");
    setError("");
    setLoading(true);

    try {
      // Save product to Firestore
      const docRef = await addDoc(collection(db, "products"), {
        name,
        description,
        manufacturerId: currentUser.uid,
        createdAt: serverTimestamp(),
      });

      setProductId(docRef.id); // use the Firestore doc id as productId
    } catch (err) {
      setError(err.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadQR = () => {
    if (qrRef.current === null) return;
    toPng(qrRef.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${productId}-qr.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-2xl shadow-lg mt-8">
      <h2 className="text-2xl font-bold text-brand mb-6">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-600">{error}</p>}

        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>

      {productId && (
        <div className="mt-6 text-center">
          <h3 className="font-semibold mb-2">Product QR Code</h3>
          <div ref={qrRef} className="inline-block bg-white p-4 rounded-lg">
            <QRCode value={`https://yourapp.com/verify/${productId}`} size={150} />
          </div>
          <button
            onClick={handleDownloadQR}
            className="mt-4 py-2 px-4 bg-brand text-white rounded-lg hover:bg-brand-dark transition"
          >
            Download QR
          </button>
        </div>
      )}
    </div>
  );
}
