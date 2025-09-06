// src/pages/VerifyProduct.jsx
import React, { useState } from "react";
import ManualVerificationForm from "../components/ManualVerificationForm";
import QRScanner from "../components/QRScanner";
import { useTheme } from "../context/ThemeContext";
import { 
  QrCodeIcon, 
  DocumentTextIcon, 
  ShieldCheckIcon,
  DevicePhoneMobileIcon
} from "@heroicons/react/24/outline";

const VerifyProduct = () => {
  const { theme, toggleTheme } = useTheme();
  const [mode, setMode] = useState("qr"); // Default to QR for mobile convenience

  return (
    <div className="min-h-screen dark:bg-grey-800 text-gray-900 dark:text-white from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-white/20 rounded-full">
              <ShieldCheckIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Verify Product Authenticity</h1>
          <p className="mt-2 text-blue-100">Scan or enter code to check if your product is genuine</p>
        </div>

        <div className="p-2">
          {/* Mode Selection Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
            <button
              onClick={() => setMode("qr")}
              className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                mode === "qr" 
                  ? "bg-white text-blue-700 shadow-md" 
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <QrCodeIcon className="h-5 w-5 mr-2" />
              Scan QR Code
            </button>
            <button
              onClick={() => setMode("manual")}
              className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                mode === "manual" 
                  ? "bg-white text-blue-700 shadow-md" 
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              Enter Code
            </button>
          </div>

          {/* Content Area */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <div className="flex items-center text-blue-700 text-sm mb-2">
              <DevicePhoneMobileIcon className="h-4 w-4 mr-1" />
              <span>Tips for best results:</span>
            </div>
            <ul className="text-xs text-blue-600 list-disc pl-5 space-y-1">
              <li>Ensure good lighting when scanning QR codes</li>
              <li>Hold your phone steady for accurate scanning</li>
              <li>Type carefully if entering code manually</li>
            </ul>
          </div>

          {/* Scanner/Form Container */}
          <div className="rounded-lg bg-gray-50 p-1 border border-gray-200">
            {mode === "manual" ? <ManualVerificationForm /> : <QRScanner />}
          </div>

          {/* Additional Help Section */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Having trouble? <button className="text-blue-600 font-medium">Get help</button>
            </p>
          </div>
        </div>
      </div>

      {/* Why Verify Section */}
      <div className="max-w-md mx-auto mt-8 bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ShieldCheckIcon className="h-5 w-5 mr-2 text-green-600" />
          Why Verify Products?
        </h2>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
              <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="ml-3 text-sm text-gray-600">Ensure you're using genuine products</p>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
              <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="ml-3 text-sm text-gray-600">Protect yourself from counterfeits</p>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
              <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="ml-3 text-sm text-gray-600">Support authentic brands and manufacturers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyProduct;