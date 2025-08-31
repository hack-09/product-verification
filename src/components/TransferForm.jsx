// src/components/TransferForm.jsx
import React, { useEffect, useState } from "react";


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
        <form onSubmit={handleSubmit} className="grid gap-3 bg-white p-4 rounded-xl shadow">
            <div>
                <label className="text-sm">From</label>
                <input className="w-full border p-2 rounded" value={from} onChange={(e)=>setFrom(e.target.value)} placeholder="e.g., Amul Plant A" />
            </div>
            <div>
                <label className="text-sm">To *</label>
                <input className="w-full border p-2 rounded" value={to} onChange={(e)=>setTo(e.target.value)} placeholder="e.g., Distributor X" required />
            </div>
            <div>
                <label className="text-sm">Note</label>
                <input className="w-full border p-2 rounded" value={note} onChange={(e)=>setNote(e.target.value)} placeholder="optional note" />
            </div>
            {withGeo && (
                <div className="text-xs text-gray-500">{geoErr ? `Location: ${geoErr}` : location ? `Location acquired` : `Fetching location…`}</div>
            )}
            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                {loading ? "Saving…" : "Add Transfer Event"}
            </button>
        </form>
    );
}