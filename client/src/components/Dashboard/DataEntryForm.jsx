import { useState } from 'react'

export default function DataEntryForm({ onSubmit }) {
    const [form, setForm] = useState({
        age: '',
        sex: 'male',
        weight: '',
        height: '',
        bpSys: '',
        bpDia: '',
        hr: '',
        glucose: '',
        cholesterol: '',
        isSmoker: false,
        hasDiabetes: false,
        hasHypertension: false,
        symptoms: []
    });

    const symptomList = ["Chest pain", "Dizziness", "Sweating", "Shortness of breath", "Palpitations", "Nausea", "Fatigue"];

    const handleSymptomChange = (symptom) => {
        setForm(prev => {
            if (prev.symptoms.includes(symptom)) {
                return { ...prev, symptoms: prev.symptoms.filter(s => s !== symptom) };
            } else {
                return { ...prev, symptoms: [...prev.symptoms, symptom] };
            }
        });
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-6">

            {/* Personal Info */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Age</label>
                    <input required type="number" placeholder="Age" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} className="input w-full border p-2 rounded mt-1" />
                </div>
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Sex</label>
                    <select value={form.sex} onChange={e => setForm({ ...form, sex: e.target.value })} className="input w-full border p-2 rounded mt-1">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                    <input type="number" placeholder="kg" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} className="input w-full border p-2 rounded mt-1" />
                </div>
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
                    <input type="number" placeholder="cm" value={form.height} onChange={e => setForm({ ...form, height: e.target.value })} className="input w-full border p-2 rounded mt-1" />
                </div>
            </div>

            {/* Vitals */}
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">BP Systolic</label>
                    <input required type="number" placeholder="120" value={form.bpSys} onChange={e => setForm({ ...form, bpSys: e.target.value })} className="input w-full border p-2 rounded mt-1" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">BP Diastolic</label>
                    <input required type="number" placeholder="80" value={form.bpDia} onChange={e => setForm({ ...form, bpDia: e.target.value })} className="input w-full border p-2 rounded mt-1" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Heart Rate</label>
                    <input required type="number" placeholder="BPM" value={form.hr} onChange={e => setForm({ ...form, hr: e.target.value })} className="input w-full border p-2 rounded mt-1" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Glucose (mg/dL)</label>
                    <input type="number" placeholder="e.g. 100" value={form.glucose} onChange={e => setForm({ ...form, glucose: e.target.value })} className="input w-full border p-2 rounded mt-1" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Cholesterol (mg/dL)</label>
                    <input type="number" placeholder="Optional" value={form.cholesterol} onChange={e => setForm({ ...form, cholesterol: e.target.value })} className="input w-full border p-2 rounded mt-1" />
                </div>
            </div>

            {/* History Flags */}
            <div className="flex gap-4 flex-wrap">
                <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={form.isSmoker} onChange={e => setForm({ ...form, isSmoker: e.target.checked })} />
                    <span className="text-sm">Smoker</span>
                </label>
                <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={form.hasDiabetes} onChange={e => setForm({ ...form, hasDiabetes: e.target.checked })} />
                    <span className="text-sm">Diabetes</span>
                </label>
                <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={form.hasHypertension} onChange={e => setForm({ ...form, hasHypertension: e.target.checked })} />
                    <span className="text-sm">Hypertension</span>
                </label>
            </div>

            {/* Symptoms */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Symptoms (Select all that apply)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {symptomList.map(s => (
                        <label key={s} className="inline-flex items-center gap-2 bg-gray-50 p-2 rounded border hover:bg-gray-100 cursor-pointer">
                            <input type="checkbox" checked={form.symptoms.includes(s)} onChange={() => handleSymptomChange(s)} />
                            <span className="text-sm">{s}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* ECG Upload */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Upload ECG (optional)</label>
                <input type="file" accept="image/*,.pdf" className="mt-2 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
        " />
            </div>

            <div className="flex gap-2 pt-4">
                <button type="submit" className="flex-1 px-4 py-3 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md">
                    Analyze Risk
                </button>
                <button type="button" className="px-4 py-3 border rounded text-gray-600 hover:bg-gray-50 font-medium">
                    Save Draft
                </button>
            </div>
        </form>
    )
}
