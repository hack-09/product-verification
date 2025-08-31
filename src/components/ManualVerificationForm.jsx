import React, { useState } from "react";
import { db } from "../services/firebase"; 
import { doc, getDoc } from "firebase/firestore";
import ProductDetails from "../components/ProductDetails";
import { useNavigate } from "react-router-dom";

const ManualVerificationForm = () => {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (!code.trim()) {
      setResult("⚠️ Please enter a code");
      return;
    }

    try {
      const docRef = doc(db, "products", code); // code = productId used while adding
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        navigate(`/verify/${docSnap.id}`);
      } else {
        setResult("❌ Invalid Code! Product not found.");
      }
    } catch (error) {
      console.error("Error verifying product:", error);
      setResult("⚠️ Error while verifying. Try again later.");
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-6 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Enter Product Code</h2>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter product code"
        className="w-full border p-2 rounded mb-4"
      />
      <button
        onClick={handleVerify}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Verify
      </button>

      {result && (
        <div className="mt-4 p-3 rounded bg-gray-100 text-center">{result}</div>
      )}
    </div>
  );
};

export default ManualVerificationForm;
