// src/components/QRScanner.jsx
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsQR from "jsqr";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { QrCodeIcon, CameraIcon } from "@heroicons/react/24/outline";

export default function QRScanner() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const lastScannedRef = useRef(""); // prevent duplicate scans

  // Draw bounding box
  const drawLine = (ctx, begin, end, color = "lime") => {
    ctx.beginPath();
    ctx.moveTo(begin.x, begin.y);
    ctx.lineTo(end.x, end.y);
    ctx.lineWidth = 4;
    ctx.strokeStyle = color;
    ctx.stroke();
  };

  const handleQRCode = async (data) => {
    if (!data || loading || data === lastScannedRef.current) return;
    lastScannedRef.current = data;
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
    } catch (err) {
      console.error(err);
      setError("Error verifying QR code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!cameraActive) return;
    let animationId;
    let lastProcessTime = 0;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute("playsinline", true); // iOS
          await videoRef.current.play();
          tick();
        }
      } catch (err) {
        console.error(err);
        setError("Cannot access camera. Check permissions and try again.");
      }
    };

    const tick = () => {
      if (!videoRef.current || !canvasRef.current) return;
      const now = Date.now();

      // Process every 100ms (reduce CPU usage)
      if (now - lastProcessTime > 100) {
        lastProcessTime = now;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height, { inversionAttempts: "attemptBoth" });

        if (code) {
          // Draw bounding box
          drawLine(ctx, code.location.topLeftCorner, code.location.topRightCorner);
          drawLine(ctx, code.location.topRightCorner, code.location.bottomRightCorner);
          drawLine(ctx, code.location.bottomRightCorner, code.location.bottomLeftCorner);
          drawLine(ctx, code.location.bottomLeftCorner, code.location.topLeftCorner);

          handleQRCode(code.data);
        }
      }

      animationId = requestAnimationFrame(tick);
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      cancelAnimationFrame(animationId);
    };
  }, [cameraActive]);

  return (
    <div className="w-full max-w-md mx-auto p-4">
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
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Activate Camera
          </button>
        </div>
      ) : (
        <div className="relative border rounded-lg overflow-hidden">
          <video ref={videoRef} className="w-full h-64 object-cover" />
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 rounded-md text-red-700 text-sm">{error}</div>
      )}
      {loading && (
        <div className="mt-4 text-blue-600 text-center font-medium">Verifying QR code...</div>
      )}
    </div>
  );
}
