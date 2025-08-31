import React, { useState } from "react";
import {QrReader} from "react-qr-reader";
import { db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";

const QRScanner = () => {
  const [result, setResult] = useState(null);

  const handleScan = async (data) => {
    if (data) {
      try {
        const docRef = doc(db, "products", data);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const product = docSnap.data();
          setResult(`✅ Product Found: ${product.name}, Batch: ${product.batch}`);
        } else {
          setResult("❌ Invalid Code! Product not found.");
        }
      } catch (error) {
        console.error("Error verifying product:", error);
        setResult("⚠️ Error while verifying. Try again later.");
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
    setResult("⚠️ Camera Error: Unable to scan QR code.");
  };

  return (
    <div className="w-full max-w-md bg-white p-6 rounded shadow text-center">
      <h2 className="text-lg font-semibold mb-4">Scan QR Code</h2>
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: "100%" }}
      />
      {result && (
        <div className="mt-4 p-3 rounded bg-gray-100">{result}</div>
      )}
    </div>
  );
};

export default QRScanner;
