import React, { useState } from "react";
import { db, storage } from "../services/firebase";
import {
  collection,
  addDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { QRCodeSVG } from "qrcode.react";

const ProductForm = () => {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productImage, setProductImage] = useState(null);

  const [batchNumber, setBatchNumber] = useState("");
  const [mfgDate, setMfgDate] = useState("");
  const [expDate, setExpDate] = useState("");

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

      // 1. Upload product image if selected
      if (productImage) {
        const imageRef = ref(
          storage,
          `productImages/${Date.now()}_${productImage.name}`
        );
        await uploadBytes(imageRef, productImage);
        imageUrl = await getDownloadURL(imageRef);
      }

      // 2. Create Product (if new). In real project, you may want to select existing product.
      const productRef = await addDoc(collection(db, "products"), {
        companyId: "company123", // TODO: take from logged in company
        name: productName,
        description: productDescription,
        imageUrl: imageUrl,
        createdAt: serverTimestamp(),
      });

      // 3. Create a Batch under that product
      const batchRef = await addDoc(
        collection(db, `products/${productRef.id}/batches`),
        {
          batchNumber,
          mfgDate,
          expDate,
          createdAt: serverTimestamp(),
        }
      );

      // 4. Generate QR code data pointing to product+batch
      const qrData = `${window.location.origin}/verify/${productRef.id}/${batchRef.id}`;
      setQrCodeUrl(qrData);

      alert("✅ Product & Batch added successfully!");

      // Reset form
      setProductName("");
      setProductDescription("");
      setProductImage(null);
      setBatchNumber("");
      setMfgDate("");
      setExpDate("");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("❌ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    const svg = document.getElementById("product-qr-code");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${productName || "product"}-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Add Product & Batch</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Fields */}
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
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

        {/* Batch Fields */}
        <input
          type="text"
          placeholder="Batch Number"
          value={batchNumber}
          onChange={(e) => setBatchNumber(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="date"
          placeholder="Manufacture Date"
          value={mfgDate}
          onChange={(e) => setMfgDate(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="date"
          placeholder="Expiry Date"
          value={expDate}
          onChange={(e) => setExpDate(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Save Product & Batch"}
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
