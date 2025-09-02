// src/components/Timeline.jsx
import React from "react";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";

export default function Timeline({ items = [] }) {
  if (!items.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        <CheckBadgeIcon className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2">No transfer events recorded yet</p>
        <p className="text-sm">Transfer events will appear here once added</p>
      </div>
    );
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {items.map((ev, idx) => (
          <li key={ev.id || idx}>
            <div className="relative pb-8">
              {idx !== items.length - 1 && (
                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
              )}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center ring-8 ring-white">
                    <CheckBadgeIcon className="h-5 w-5 text-white" />
                  </span>
                </div>
                <div className="min-w-0 flex-1 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {ev.from ? `${ev.from} → ${ev.to}` : `To: ${ev.to}`}
                    </h3>
                    {ev.note && (
                      <p className="mt-1 text-sm text-gray-600">{ev.note}</p>
                    )}
                    {ev.location?.label && (
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {ev.location.label}
                      </div>
                    )}
                    {ev.createdAt?.toDate && (
                      <p className="mt-1 text-xs text-gray-400">
                        {ev.createdAt.toDate().toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}