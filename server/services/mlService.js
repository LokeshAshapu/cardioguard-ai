// This acts as a reliable statistical layer (Logistic Regression Mock)
// In a real app, this would call a Python microservice serving a .pkl model

const calculateStatisticalRisk = (data) => {
    let riskScore = 0;

    // 1. Age Factor
    if (data.age > 45) riskScore += 10;
    if (data.age > 60) riskScore += 10;

    // 2. BMI Calculation (Weight kg / Height m^2)
    const heightInMeters = data.height / 100;
    const bmi = data.weight / (heightInMeters * heightInMeters);
    if (bmi > 25) riskScore += 5; // Overweight
    if (bmi > 30) riskScore += 10; // Obese

    // 3. Blood Pressure
    if (data.systolicBP > 130 || data.diastolicBP > 80) riskScore += 10;
    if (data.systolicBP > 140 || data.diastolicBP > 90) riskScore += 10; // High BP Stage 2

    // 4. Cholesterol
    if (data.cholesterol > 200) riskScore += 10;

    // 5. Smoker
    if (data.isSmoker) riskScore += 15;

    // 6. Medical History
    if (data.hasDiabetes) riskScore += 10;
    if (data.hasHypertension) riskScore += 5;

    // Cap score at 100
    riskScore = Math.min(riskScore, 99);

    // Determine Probability %
    return {
        heartAttackProb: Math.min(riskScore + 5, 95),
        strokeProb: Math.min(riskScore + 2, 90),
        diabeticProb: data.hasDiabetes ? Math.min(riskScore + 15, 95) : Math.min(riskScore / 2, 50),
        overallRiskScore: riskScore
    };
};

module.exports = { calculateStatisticalRisk };
