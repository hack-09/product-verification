import React, { useState } from "react";
import ProductForm from "../components/ProductForm";
import QRCodeDisplay from "../components/QRCodeDisplay";
import { useAuth } from "../context/AuthContext"; 
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [productId, setProductId] = useState(null);
    const { user, signOutUser } = useAuth(); 
    const navigate = useNavigate(); 
    const handleSignOut = async () => { 
        await signOutUser(); 
        navigate("/login"); 
    };
    const handleVerify = async () => { 
        navigate("/verify"); 
    };
    const handleProductDetails = async () => { 
        navigate("/verify"); 
    };

    return (
    <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
    <p>Welcome {user?.displayName || user?.email}</p>
    <button onClick={handleSignOut}>Sign out</button>
    <button onClick={handleVerify}>Verify</button>
    <button onClick={handleProductDetails}>Product Details</button>
    <ProductForm onProductCreated={(id) => setProductId(id)} />
    {productId && <QRCodeDisplay productId={productId} />}
    </div>
    );
};


export default Dashboard;