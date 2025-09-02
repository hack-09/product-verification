import React, { useState, useEffect } from "react";
import { db, auth, storage } from "../services/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  PlusIcon,
  PhotoIcon,
  BuildingStorefrontIcon,
  CubeIcon,
  TagIcon,
  CalendarDaysIcon
} from "@heroicons/react/24/outline";

export default function AddProductForm() {
  const [companies, setCompanies] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [newCompany, setNewCompany] = useState({ name: "", address: "", contact: "" });
  const [showNewCompanyForm, setShowNewCompanyForm] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: "",
    basePrice: "",
    imageUrl: "",
  });
  const [batches, setBatches] = useState([
    { batchNumber: "", mfgDate: "", expDate: "", stock: "", price: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Load companies for dropdown
  useEffect(() => {
    const fetchCompanies = async () => {
      const querySnapshot = await getDocs(collection(db, "companies"));
      setCompanies(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchCompanies();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBatchChange = (index, field, value) => {
    const newBatches = [...batches];
    newBatches[index][field] = value;
    setBatches(newBatches);
  };

  const addBatchRow = () => {
    setBatches([...batches, { batchNumber: "", mfgDate: "", expDate: "", stock: "", price: "" }]);
  };

  const removeBatchRow = (index) => {
    if (batches.length > 1) {
      const newBatches = [...batches];
      newBatches.splice(index, 1);
      setBatches(newBatches);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      let companyId = selectedCompany;

      // If new company entered
      if (!companyId && newCompany.name) {
        const newCompanyRef = await addDoc(collection(db, "companies"), newCompany);
        companyId = newCompanyRef.id;
      }

      let imageUrl = "";
      if (imageFile) {
        const storageRef = ref(storage, `productImages/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      // Add product
      const productRef = await addDoc(collection(db, "products"), {
        ...product,
        companyId,
        basePrice: Number(product.basePrice),
        imageUrl,
        createdBy: auth.currentUser.uid
      });

      // Add batches under product
      for (const batch of batches) {
        await addDoc(collection(db, "products", productRef.id, "batches"), {
          ...batch,
          stock: Number(batch.stock),
          price: batch.price ? Number(batch.price) : Number(product.basePrice),
        });
      }

      setSuccess(true);
      // Reset form
      setProduct({ name: "", description: "", category: "", basePrice: "" });
      setBatches([{ batchNumber: "", mfgDate: "", expDate: "", stock: "", price: "" }]);
      setImageFile(null);
      setImagePreview(null);
      setSelectedCompany("");
      setNewCompany({ name: "", address: "", contact: "" });
      setShowNewCompanyForm(false);
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <CubeIcon className="h-6 w-6 mr-2 text-indigo-600" />
          Add New Product
        </h2>
        <p className="text-gray-600 mt-1">Fill in the details to add a new product to your inventory</p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md border border-green-200">
          Product with batches added successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Selection */}
        <div className="bg-gray-50 p-5 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <BuildingStorefrontIcon className="h-5 w-5 mr-2 text-indigo-600" />
            Company Information
          </h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Existing Company</label>
            <select
              value={selectedCompany}
              onChange={(e) => {
                setSelectedCompany(e.target.value);
                setShowNewCompanyForm(false);
              }}
              className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">-- Select Company --</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-sm text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowNewCompanyForm(!showNewCompanyForm);
              setSelectedCompany("");
            }}
            className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 mb-4"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            {showNewCompanyForm ? "Hide New Company Form" : "Add New Company"}
          </button>

          {showNewCompanyForm && (
            <div className="space-y-4 p-4 bg-white rounded-md border border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  placeholder="Company Name"
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  placeholder="Address"
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={newCompany.address}
                  onChange={(e) => setNewCompany({ ...newCompany, address: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                <input
                  type="text"
                  placeholder="Contact"
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={newCompany.contact}
                  onChange={(e) => setNewCompany({ ...newCompany, contact: e.target.value })}
                />
              </div>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="bg-gray-50 p-5 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <TagIcon className="h-5 w-5 mr-2 text-indigo-600" />
            Product Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                placeholder="Product Name"
                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                placeholder="Category"
                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={product.category}
                onChange={(e) => setProduct({ ...product, category: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              placeholder="Description"
              rows={3}
              className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
            />
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Base Price</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">₹</span>
              </div>
              <input
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                className="block w-full pl-8 border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={product.basePrice}
                onChange={(e) => setProduct({ ...product, basePrice: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
            <div className="mt-1 flex items-center">
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-md" />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center w-full">
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                      <span>Upload an image</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Batches */}
        <div className="bg-gray-50 p-5 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <CalendarDaysIcon className="h-5 w-5 mr-2 text-indigo-600" />
              Batch Information
            </h3>
            <button
              type="button"
              onClick={addBatchRow}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Batch
            </button>
          </div>
          
          {batches.map((batch, index) => (
            <div key={index} className="border border-gray-200 p-4 rounded-md mb-4 bg-white">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-700">Batch #{index + 1}</h4>
                {batches.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeBatchRow(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number</label>
                  <input
                    type="text"
                    placeholder="Batch Number"
                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={batch.batchNumber}
                    onChange={(e) => handleBatchChange(index, "batchNumber", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    placeholder="Stock"
                    min="0"
                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={batch.stock}
                    onChange={(e) => handleBatchChange(index, "stock", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturing Date</label>
                  <input
                    type="date"
                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={batch.mfgDate}
                    onChange={(e) => handleBatchChange(index, "mfgDate", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={batch.expDate}
                    onChange={(e) => handleBatchChange(index, "expDate", e.target.value)}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (optional)</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">₹</span>
                    </div>
                    <input
                      type="number"
                      placeholder="Leave empty to use base price"
                      min="0"
                      step="0.01"
                      className="block w-full pl-8 border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={batch.price}
                      onChange={(e) => handleBatchChange(index, "price", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              "Save Product"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}