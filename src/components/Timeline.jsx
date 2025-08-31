// src/components/Timeline.jsx
import React from "react";


export default function Timeline({ items = [] }) {
    if (!items.length) return (
        <div className="p-4 rounded bg-gray-50">No transfer events recorded yet.</div>
    );

    return (
        <ol className="relative border-s border-gray-200">
            {items.map((ev, idx) => (
                <li key={ev.id || idx} className="mb-8 ms-6">
                    <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-xs">{idx+1}</span>
                    <h3 className="text-base font-semibold">
                        {ev.from ? `${ev.from} → ` : ""}{ev.to || "(unknown)"}
                    </h3>
                    {ev.note && <p className="text-sm text-gray-700 mt-1">{ev.note}</p>}
                    {ev.location?.label && (
                        <p className="text-xs text-gray-500 mt-1">📍 {ev.location.label}</p>
                    )}
                    {ev.createdAt?.toDate && (
                        <p className="text-xs text-gray-400 mt-1">{ev.createdAt.toDate().toLocaleString()}</p>
                    )}
                </li>
            ))}
        </ol>
    );
}