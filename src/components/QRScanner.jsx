// src/components/QRScanner.jsx
import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import { db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { QrCodeIcon, CameraIcon } from "@heroicons/react/24/outline";

const QRScanner = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const navigate = useNavigate();

  const handleScan = async (data) => {
    if (data && !loading) {
      setLoading(true);
      setError("");
      
      try {
        const docRef = doc(db, "products", data);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          navigate(`/verify/${docSnap.id}`);
        } else {
          setError("Invalid QR code! Product not found.");
        }
      } catch (error) {
        console.error("Error verifying product:", error);
        setError("Error while verifying. Try again later.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
    setError("Camera error: Unable to scan QR code. Please check camera permissions.");
  };

  return (
    <div className="w-full">
      <div className="flex items-center mb-4">
        <QrCodeIcon className="h-5 w-5 text-gray-500 mr-2" />
        <h2 className="text-lg font-medium text-gray-900">Scan QR Code</h2>
      </div>
      
      {!cameraActive ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg h-64 flex flex-col items-center justify-center p-4 text-center">
          <CameraIcon className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500 mb-4">Camera not active</p>
          <button
            onClick={() => setCameraActive(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Activate Camera
          </button>
        </div>
      ) : (
        <div className="relative">
          <QrReader
            delay={300}
            onError={handleError}
            onResult={handleScan}
            constraints={{ facingMode: "environment" }}
            className="rounded-lg overflow-hidden"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="border-2 border-blue-500 rounded-lg w-48 h-48"></div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}
      
      {loading && (
        <div className="mt-4 flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Verifying product...</span>
        </div>
      )}
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Having trouble scanning?{' '}
          <button 
            onClick={() => setCameraActive(!cameraActive)}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            {cameraActive ? 'Turn off camera' : 'Turn on camera'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default QRScanner;