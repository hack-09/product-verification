import React, { useState } from "react";
import ManualVerificationForm from "../components/ManualVerificationForm";
import QRScanner from "../components/QRScanner";

const VerifyProduct = () => {
  const [mode, setMode] = useState("manual"); // manual | qr

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Verify Product</h1>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setMode("manual")}
          className={`px-4 py-2 rounded ${
            mode === "manual" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Manual Code
        </button>
        <button
          onClick={() => setMode("qr")}
          className={`px-4 py-2 rounded ${
            mode === "qr" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          QR Scanner
        </button>
      </div>

      {mode === "manual" ? <ManualVerificationForm /> : <QRScanner />}
    </div>
  );
};

export default VerifyProduct;
