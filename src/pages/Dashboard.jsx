import React, { useState } from "react";
import ProductForm from "./ProductForm";
import QRCodeDisplay from "./QRCodeDisplay";


const Dashboard = () => {
const [productId, setProductId] = useState(null);


return (
<div className="p-6">
<h1 className="text-2xl font-bold mb-4">Dashboard</h1>
<ProductForm onProductCreated={(id) => setProductId(id)} />
{productId && <QRCodeDisplay productId={productId} />}
</div>
);
};


export default Dashboard;