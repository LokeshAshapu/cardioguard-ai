const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
require('dotenv').config({ path: 'C:/Users/ASUS/Downloads/JNTU_GV/CardioGuardAI/server/.env' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        console.log("Testing API Key with REST call to list models...");
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("No API Key found in .env");
            return;
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        let output = "Available Models:\n";
        if (data.error) {
            output = "API Error: " + JSON.stringify(data.error);
            console.error("API Error:", data.error);
        } else {
            if (data.models) {
                data.models.forEach(m => {
                    if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
                        output += `- ${m.name}\n`;
                    }
                });
            } else {
                output += "No models found or different response format: " + JSON.stringify(data);
            }
        }

        const outputPath = 'C:/Users/ASUS/Downloads/JNTU_GV/models_list.txt';
        fs.writeFileSync(outputPath, output);
        console.log(`Wrote models to ${outputPath}`);

    } catch (error) {
        console.error("Script Error:", error);
    }
}

listModels();
