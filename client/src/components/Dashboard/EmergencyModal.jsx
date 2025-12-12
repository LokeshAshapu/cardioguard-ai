import React from 'react';

export default function EmergencyModal({ open, onClose, onCall, onNotify }) {
    if (!open) return null
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-xl w-full shadow-lg border-2 border-red-500">
                <h2 className="text-xl font-bold text-red-600 flex items-center gap-2">
                    ⚠️ EMERGENCY — Immediate Action Required
                </h2>
                <p className="mt-2 text-gray-700">We recommend calling emergency services now. We can also notify your emergency contact.</p>
                <div className="mt-6 flex flex-col md:flex-row gap-4">
                    <button onClick={onCall} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-3 rounded shadow-md transition-all">
                        Call Ambulance
                    </button>
                    <button onClick={onNotify} className="flex-1 bg-white border-2 border-red-600 text-red-600 font-bold px-4 py-3 rounded hover:bg-red-50 transition-all">
                        Notify Contact
                    </button>
                    <button onClick={onClose} className="px-4 py-2 text-gray-500 hover:text-gray-700">Dismiss</button>
                </div>
            </div>
        </div>
    )
}
