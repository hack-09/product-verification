import React, { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";


const QRCodeDisplay = ({ productId }) => {
    const svgRef = useRef(null);

    const downloadQR = () => {
        const svg = svgRef.current.querySelector("svg");
        const serializer = new XMLSerializer();
        const source = serializer.serializeToString(svg);
        const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `product-${productId}.svg`;
        link.click();
    };


    return (
    <div className="mt-6 text-center" ref={svgRef}>
    <h2 className="text-lg font-semibold mb-2">Product QR Code</h2>
    <QRCodeSVG value={productId} size={180} />
    <div className="mt-4">
    <button
    onClick={downloadQR}
    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    >
    Download QR
    </button>
    </div>
    </div>
    );
};


export default QRCodeDisplay;