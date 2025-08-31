import React, { useState } from "react";
import { db, storage } from "../services/firebase"; // make sure you exported storage in firebase.js
import {
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";
import {QRCodeSVG} from "qrcode.react";

const ProductForm = () => {
  const [productName, setProductName] = useState("");
  const [productCode, setProductCode] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setProductImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";

      // Upload product image if selected
      if (productImage) {
        const imageRef = ref(
          storage,
          `productImages/${Date.now()}_${productImage.name}`
        );
        await uploadBytes(imageRef, productImage);
        imageUrl = await getDownloadURL(imageRef);
      }

      // Create Firestore document
      const docRef = await addDoc(collection(db, "products"), {
        name: productName,
        code: productCode,
        description: productDescription,
        imageUrl: imageUrl,
        createdAt: serverTimestamp(),
      });

      // Generate QR code data (using document ID or code)
      const qrData = `${window.location.origin}/verify/${docRef.id}`;
      setQrCodeUrl(qrData);

      alert("✅ Product added successfully!");
      setProductName("");
      setProductCode("");
      setProductDescription("");
      setProductImage(null);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("❌ Error adding product: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    const canvas = document.getElementById("product-qr-code");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${productName || "product"}-qr.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Product Code"
          value={productCode}
          onChange={(e) => setProductCode(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          placeholder="Product Description"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Save Product"}
        </button>
      </form>

      {qrCodeUrl && (
        <div className="mt-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Product QR Code:</h3>
          <QRCodeSVG id="product-qr-code" value={qrCodeUrl} size={200} />
          <br />
          <button
            onClick={downloadQR}
            className="mt-2 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Download QR
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductForm;
