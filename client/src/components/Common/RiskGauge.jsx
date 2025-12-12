import React from 'react';

export default function RiskGauge({ value, label }) {
    const color = value < 30 ? 'bg-green-500' : value < 60 ? 'bg-amber-400' : 'bg-red-500'
    return (
        <div className="flex items-center gap-4">
            <div className="w-36 h-36 rounded-full bg-gradient-to-br from-white/60 to-white/10 flex items-center justify-center shadow-lg">
                <div className="text-center">
                    <div className={`text-4xl font-bold ${value < 60 ? 'text-black' : 'text-white'}`}>{value}%</div>
                    <div className="text-sm text-gray-700 font-medium">{label}</div>
                </div>
            </div>
            <div className="flex-1">
                <div className="text-sm text-gray-600">Interpretation</div>
                <div className="mt-2 text-base font-semibold">{value < 30 ? 'Low' : value < 60 ? 'Moderate' : 'High'}</div>
            </div>
        </div>
    )
}
