import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Activity, Heart, Scale, AlertTriangle, CheckCircle, Thermometer } from 'lucide-react';

const InputPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        age: 30,
        gender: 'Male',
        weight: 75,
        height: 175,
        systolicBP: 120,
        diastolicBP: 80,
        heartRate: 72,
        cholesterol: 180,
        bloodSugar: 90,
        isSmoker: false,
        hasDiabetes: false,
        hasHypertension: false,
        activityLevel: 'moderate',
        symptoms: []
    });

    const symptomsList = [
        'Chest Pain', 'Shortness of Breath', 'Dizziness', 'Palpitations',
        'Numbness', 'Sweating', 'Fatigue', 'Nausea'
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSymptomChange = (symptom) => {
        setFormData(prev => ({
            ...prev,
            symptoms: prev.symptoms.includes(symptom)
                ? prev.symptoms.filter(s => s !== symptom)
                : [...prev.symptoms, symptom]
        }));
    };

    const handleBluetoothConnect = async () => {
        try {
            const device = await navigator.bluetooth.requestDevice({
                filters: [{ services: ['heart_rate'] }]
            });

            const server = await device.gatt.connect();
            const service = await server.getPrimaryService('heart_rate');
            const characteristic = await service.getCharacteristic('heart_rate_measurement');

            const value = await characteristic.readValue();
            const hr = value.getUint8(1); // Standard parsing for 8-bit HR format

            setFormData(prev => ({ ...prev, heartRate: hr }));
            alert(`Connected to ${device.name}! Heart Rate synced: ${hr} BPM`);
        } catch (error) {
            console.error(error);
            // Fallback for hackathon demo if no device is present
            if (confirm("Bluetooth device not found. Simulate connection for demo?")) {
                const mockHR = Math.floor(Math.random() * (100 - 60) + 60);
                setFormData(prev => ({ ...prev, heartRate: mockHR }));
                alert(`Simulated Wearable Connected! Heart Rate: ${mockHR} BPM`);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            };
            const { data } = await axios.post('http://localhost:5000/api/predict', formData, config);
            // Pass data to results/dashboard page
            navigate('/dashboard', { state: { prediction: data } });
        } catch (error) {
            console.error(error);
            alert('Error generating prediction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-bgDark p-6 md:p-12">
            <div className="max-w-4xl mx-auto glass-panel p-8 bg-white/50 dark:bg-cardDark/50">
                <div className="flex items-center gap-3 mb-6">
                    <Activity className="text-primary w-8 h-8" />
                    <h1 className="text-2xl font-bold">New Health Assessment</h1>
                </div>

                {/* DEMO MODE BUTTONS - FOR HACKATHON DEMO */}
                <div className="mb-8 p-4 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">⚡ Quick Demo Prefill</h3>
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => setFormData({
                                age: 25, gender: 'Female', weight: 60, height: 165, systolicBP: 110, diastolicBP: 70,
                                heartRate: 65, cholesterol: 160, bloodSugar: 85, isSmoker: false, hasDiabetes: false,
                                hasHypertension: false, activityLevel: 'high', symptoms: []
                            })}
                            className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-bold hover:bg-green-200 transition-colors"
                        >
                            🟢 Healthy
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({
                                age: 55, gender: 'Male', weight: 95, height: 175, systolicBP: 145, diastolicBP: 95,
                                heartRate: 88, cholesterol: 240, bloodSugar: 130, isSmoker: true, hasDiabetes: true,
                                hasHypertension: true, activityLevel: 'low', symptoms: ['Fatigue', 'Dizziness']
                            })}
                            className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-bold hover:bg-yellow-200 transition-colors"
                        >
                            🟡 At Risk
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({
                                age: 55, gender: 'Male', weight: 95, height: 175, systolicBP: 180, diastolicBP: 110,
                                heartRate: 115, cholesterol: 280, bloodSugar: 200, isSmoker: true, hasDiabetes: true,
                                hasHypertension: true, activityLevel: 'sedentary', symptoms: ['Chest Pain', 'Shortness of Breath', 'Sweating', 'Nausea']
                            })}
                            className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-bold hover:bg-red-200 transition-colors"
                        >
                            🔴 Critical (Emergency)
                        </button>
                    </div>
                </div>

                {/* WEARABLE CONNECTION */}
                <div className="mb-6 flex justify-end">
                    <button
                        type="button"
                        onClick={handleBluetoothConnect}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all font-medium"
                    >
                        <Activity className="w-5 h-5" />
                        Connect Wearable (BLE)
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Section 1: Demographics */}
                    <div>
                        <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                            Basic Profile
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-1">Age</label>
                                <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full input-field p-2 rounded-lg border bg-white dark:bg-black/20" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full input-field p-2 rounded-lg border bg-white dark:bg-black/20">
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                                <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full input-field p-2 rounded-lg border bg-white dark:bg-black/20" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Height (cm)</label>
                                <input type="number" name="height" value={formData.height} onChange={handleChange} className="w-full input-field p-2 rounded-lg border bg-white dark:bg-black/20" />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Vitals */}
                    <div>
                        <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                            <Heart className="w-5 h-5" /> Vitals
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-1">Systolic BP</label>
                                <input type="number" name="systolicBP" value={formData.systolicBP} onChange={handleChange} className="w-full input-field p-2 rounded-lg border bg-white dark:bg-black/20" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Diastolic BP</label>
                                <input type="number" name="diastolicBP" value={formData.diastolicBP} onChange={handleChange} className="w-full input-field p-2 rounded-lg border bg-white dark:bg-black/20" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Heart Rate (BPM)</label>
                                <input type="number" name="heartRate" value={formData.heartRate} onChange={handleChange} className="w-full input-field p-2 rounded-lg border bg-white dark:bg-black/20" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Cholesterol (mg/dL)</label>
                                <input type="number" name="cholesterol" value={formData.cholesterol} onChange={handleChange} className="w-full input-field p-2 rounded-lg border bg-white dark:bg-black/20" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Fasting Blood Sugar</label>
                                <input type="number" name="bloodSugar" value={formData.bloodSugar} onChange={handleChange} className="w-full input-field p-2 rounded-lg border bg-white dark:bg-black/20" />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Lifestyle & History */}
                    <div>
                        <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                            History & Lifestyle
                        </h3>
                        <div className="flex flex-wrap gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" name="isSmoker" checked={formData.isSmoker} onChange={handleChange} className="w-5 h-5 text-primary rounded" />
                                <span>Smoker</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" name="hasDiabetes" checked={formData.hasDiabetes} onChange={handleChange} className="w-5 h-5 text-primary rounded" />
                                <span>Diabetic</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" name="hasHypertension" checked={formData.hasHypertension} onChange={handleChange} className="w-5 h-5 text-primary rounded" />
                                <span>Hypertension</span>
                            </label>
                        </div>
                    </div>

                    {/* Section 4: Symptoms */}
                    <div>
                        <h3 className="text-lg font-semibold text-rose-500 mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" /> Current Symptoms
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {symptomsList.map(symptom => (
                                <button
                                    key={symptom}
                                    type="button"
                                    onClick={() => handleSymptomChange(symptom)}
                                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${formData.symptoms.includes(symptom)
                                        ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/30'
                                        : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-rose-300'
                                        }`}
                                >
                                    {symptom}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-primary to-rose-600 text-white font-bold py-4 rounded-xl shadow-xl shadow-primary/25 hover:shadow-2xl hover:scale-[1.01] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Analyzing with AI...' : 'Generate AI Risk Prediction'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default InputPage;
