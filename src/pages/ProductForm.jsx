import React, { useState } from "react";
import { db } from "../services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const ProductForm = ({ onProductCreated }) => {
    const [product, setProduct] = useState({
        name: "",
        description: "",
    });

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const docRef = await addDoc(collection(db, "products"), {
            ...product,
            createdAt: serverTimestamp(),
            });
            onProductCreated(docRef.id);
            setProduct({ name: "", description: "" });
        } catch (err) {
            console.error("Error adding product:", err);
        }
    };


    return (
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={product.name}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                required
            />
            <textarea
                name="description"
                placeholder="Product Description"
                value={product.description}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                required
            />
            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Save Product
            </button>
        </form>
    );
};

export default ProductForm;