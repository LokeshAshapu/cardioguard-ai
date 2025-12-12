const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getClinicalReasoning = async (data, riskStats) => {
    const prompt = `
        System: You are CardioGuard AI, an evidence-based clinical reasoning assistant.
        You:
        - Provide clear, concise, non-prescriptive medical guidance.
        - Follow AHA (American Heart Association) and ADA (American Diabetes Association) red-flag rules.
        - Never give medication names, dosages, or treatment plans.
        - Explain risks using simple, non-technical language.
        - Prioritize safety: highlight red flags and when to seek emergency care.
        - Support your reasoning with vital signs, symptoms, and model scores.
        - If data is missing or unclear, ask for clarification.
        - Always include a one-line medical disclaimer.

        Context:
        - Age: ${data.age}
        - Sex: ${data.gender}
        - Vitals: BP ${data.systolicBP}/${data.diastolicBP}, HR ${data.heartRate}, Glucose ${data.bloodSugar}, Cholesterol ${data.cholesterol}
        - Symptoms: ${data.symptoms.join(', ')}
        - ML Model Scores:
          - Heart Attack Risk: ${riskStats.heartAttackProb}%
          - Stroke Risk: ${riskStats.strokeProb}%
          - Diabetic Emergency Risk: ${riskStats.overallRiskScore}%

        Task:
        1. Explain what these numbers mean in simple language.
        2. Identify the biggest contributors to the user's risk.
        3. Provide exactly THREE immediate steps the user should take.
        4. Highlight any red-flag symptoms that require going to the hospital NOW.
        5. Suggest non-prescriptive tests the user may consider discussing with a clinician.
        6. Keep the explanation within 120–180 words.
        7. End with: "Disclaimer: This is not medical advice. Seek professional care for emergencies."

        Output format in JSON strictly:
        {
            "analysis": "Plain language explanation...",
            "urgency": "High",
            "explanation": "Key factors driving this risk...",
            "recommendations": ["Step 1", "Step 2", "Step 3"]
        }
        `;

    try {
        console.log("Attempting Gemini Clinical Reasoning...");
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(text);
    } catch (geminiError) {
        console.error("Gemini Error:", geminiError.message);
        console.log("Switching to NVIDIA Backup...");
        return await callNvidiaBackup(prompt);
    }
};

const callNvidiaBackup = async (prompt) => {
    if (!process.env.NVIDIA_API_KEY || process.env.NVIDIA_API_KEY.startsWith('nvapi-xxxx')) {
        console.warn("NVIDIA API Key not configured.");
        return getFallbackResponse();
    }

    try {
        // Updated model to Llama 3.1 70B
        const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "meta/llama-3.1-70b-instruct",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.2,
                top_p: 0.7,
                max_tokens: 1024
            })
        });

        const data = await response.json();
        console.log("NVIDIA Raw Response:", JSON.stringify(data, null, 2));

        if (data.choices && data.choices[0]) {
            let text = data.choices[0].message.content;

            // robust json extraction
            const jsonStart = text.indexOf('{');
            const jsonEnd = text.lastIndexOf('}');

            if (jsonStart !== -1 && jsonEnd !== -1) {
                const jsonString = text.substring(jsonStart, jsonEnd + 1);
                try {
                    return JSON.parse(jsonString);
                } catch (e) {
                    console.error("JSON Parse Error:", e);
                    // fall through to error
                }
            }
        }
        throw new Error("Invalid NVIDIA response structure");
    } catch (nvidiaError) {
        console.error("NVIDIA Backup Error:", nvidiaError.message);
        // CRITICAL: Return a valid structure so the frontend shows something!
        return getFallbackResponse();
    }
};

const getFallbackResponse = () => ({
    analysis: "AI services are currently experiencing high traffic. However, based on the statistical analysis, your metrics have been recorded. Please consult a healthcare professional for a detailed evaluation.",
    urgency: "Medium",
    explanation: "This is a generated fallback assessment because the external AI service is temporarily unavailable (Rate Limit/Connection Error).",
    recommendations: ["Consult a doctor", "Monitor Vital Signs", "Maintain Healthy Diet"]
});

module.exports = { getClinicalReasoning };
