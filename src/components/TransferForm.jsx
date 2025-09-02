// src/components/TransferForm.jsx
import React, { useEffect, useState } from "react";
import { PaperAirplaneIcon, MapPinIcon } from "@heroicons/react/24/outline";

export default function TransferForm({ defaultFrom = "", onSubmit, withGeo = true }) {
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState("");
  const [note, setNote] = useState("");
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [geoErr, setGeoErr] = useState("");

  useEffect(() => {
    if (!withGeo) return;
    if (!navigator.geolocation) {
      setGeoErr("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => setGeoErr(err.message),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [withGeo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ from, to, note, location });
      setTo("");
      setNote("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
        <input
          className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder="e.g., Amul Plant A"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">To *</label>
        <input
          className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="e.g., Distributor X"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
        <textarea
          rows={3}
          className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional note about this transfer"
        />
      </div>
      {withGeo && (
        <div className="flex items-center text-sm text-gray-500">
          <MapPinIcon className="h-4 w-4 mr-1" />
          {geoErr ? `Location error: ${geoErr}` : location ? "Location acquired" : "Fetching location…"}
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Saving...
          </>
        ) : (
          <>
            <PaperAirplaneIcon className="h-4 w-4 mr-2" />
            Add Transfer Event
          </>
        )}
      </button>
    </form>
  );
}