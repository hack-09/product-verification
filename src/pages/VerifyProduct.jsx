// src/pages/VerifyProduct.jsx
import React, { useState } from "react";
import ManualVerificationForm from "../components/ManualVerificationForm";
import QRScanner from "../components/QRScanner";
import { QrCodeIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

const VerifyProduct = () => {
  const [mode, setMode] = useState("manual"); // manual | qr

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border p-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Verify Product</h1>
        <p className="mt-1 text-gray-600">Check the authenticity of your product</p>
      </div>

      <div className="flex space-x-2 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setMode("manual")}
          className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium ${
            mode === "manual" 
              ? "bg-white text-blue-600 shadow-sm" 
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <DocumentTextIcon className="h-5 w-5 mr-2" />
          Manual Code
        </button>
        <button
          onClick={() => setMode("qr")}
          className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium ${
            mode === "qr" 
              ? "bg-white text-blue-600 shadow-sm" 
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <QrCodeIcon className="h-5 w-5 mr-2" />
          QR Scanner
        </button>
      </div>

      {mode === "manual" ? <ManualVerificationForm /> : <QRScanner />}
    </div>
  );
};

export default VerifyProduct;