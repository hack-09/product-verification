// src/components/ManualVerificationForm.jsx
import React, { useState } from "react";
import { db } from "../services/firebase"; 
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { DocumentMagnifyingGlassIcon } from "@heroicons/react/24/outline";

const ManualVerificationForm = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (!code.trim()) {
      setError("Please enter a product code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const docRef = doc(db, "products", code);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        navigate(`/verify/${docSnap.id}`);
      } else {
        setError("Invalid code! Product not found.");
      }
    } catch (error) {
      console.error("Error verifying product:", error);
      setError("Error while verifying. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center mb-4">
        <DocumentMagnifyingGlassIcon className="h-5 w-5 text-gray-500 mr-2" />
        <h2 className="text-lg font-medium text-gray-900">Enter Product Code</h2>
      </div>
      
      <input
        type="text"
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
          setError("");
        }}
        placeholder="Enter product code"
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      
      {error && (
        <div className="mt-2 text-sm text-red-600">{error}</div>
      )}
      
      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Verifying...
          </span>
        ) : (
          "Verify Product"
        )}
      </button>
    </div>
  );
};

export default ManualVerificationForm;