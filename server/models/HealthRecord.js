const mongoose = require('mongoose');

const healthRecordSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    weight: { type: Number, required: true },
    height: { type: Number, required: true },
    systolicBP: { type: Number, required: true },
    diastolicBP: { type: Number, required: true },
    heartRate: { type: Number, required: true },
    cholesterol: { type: Number, required: true }, // Total Cholesterol
    bloodSugar: { type: Number, required: true }, // Fasting
    isSmoker: { type: Boolean, default: false },
    hasDiabetes: { type: Boolean, default: false },
    hasHypertension: { type: Boolean, default: false },
    activityLevel: { type: String, default: 'moderate' }, // sedentary, moderate, active
    symptoms: [{ type: String }],
    riskScore: { type: Number }, // 0-100
    riskLevel: { type: String }, // Low, Medium, High, Critical
    ecgImageUrl: { type: String },
    predictionDate: { type: Date, default: Date.now }
});

const HealthRecord = mongoose.model('HealthRecord', healthRecordSchema);
module.exports = HealthRecord;
