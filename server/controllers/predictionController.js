const HealthRecord = require('../models/HealthRecord');
const { calculateStatisticalRisk } = require('../services/mlService');
const { getClinicalReasoning } = require('../services/llmService');
const { checkGuidelines } = require('../services/guidelinesService');

// @desc    Analyze health data and predict risk
// @route   POST /api/predict
// @access  Private
const predictRisk = async (req, res) => {
    try {
        const data = req.body;

        // 1. Statistical ML Model
        const riskStats = calculateStatisticalRisk(data);

        // 2. Guidelines Check
        const guidelinesAlerts = checkGuidelines(data);

        // 3. LLM Reasoning (Async - could take 2-3 seconds)
        const aiAnalysis = await getClinicalReasoning(data, riskStats);

        // 4. Determine Final Emergency Status from all inputs
        let finalStatus = aiAnalysis.urgency || 'Low';
        if (riskStats.overallRiskScore > 80) finalStatus = 'High';
        if (guidelinesAlerts.some(a => a.level === 'CRITICAL')) finalStatus = 'Critical';

        // 5. Save Record
        const record = new HealthRecord({
            user: req.user._id,
            ...data,
            riskScore: riskStats.overallRiskScore,
            riskLevel: finalStatus,
        });
        await record.save();

        res.json({
            statisticalRisk: riskStats,
            guidelines: guidelinesAlerts,
            aiAnalysis: aiAnalysis,
            finalStatus: finalStatus,
            timestamp: new Date()
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Prediction Engine Failed' });
    }
};

// @desc    Get user's history
// @route   GET /api/predict/history
// @access  Private
const getHistory = async (req, res) => {
    try {
        const records = await HealthRecord.find({ user: req.user._id }).sort({ predictionDate: -1 });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { predictRisk, getHistory };
