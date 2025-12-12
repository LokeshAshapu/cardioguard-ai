// Rules based on AHA and WHO guidelines (Simplified)

const checkGuidelines = (data) => {
    const alerts = [];

    // Hypertensive Crisis
    if (data.systolicBP > 180 || data.diastolicBP > 120) {
        alerts.push({
            level: 'CRITICAL',
            message: 'Hypertensive Crisis Detected. Seek emergency care immediately.',
            source: 'AHA Guidelines'
        });
    }

    // Tachycardia
    if (data.heartRate > 100 && data.activityLevel === 'sedentary') {
        alerts.push({
            level: 'WARNING',
            message: 'Resting Heart Rate is high (Tachycardia).',
            source: 'Mayo Clinic Standards'
        });
    }

    // Diabetic Concern
    if (data.bloodSugar > 126 && !data.hasDiabetes) {
        alerts.push({
            level: 'HIGH',
            message: 'Fasting blood sugar indicates potential Diabetes.',
            source: 'ADA Standards'
        });
    }

    return alerts;
};

module.exports = { checkGuidelines };
