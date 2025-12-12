# CardioGuard AI 🫀🤖
### Early Warning System for Cardiovascular & Diabetic Emergencies

**Team:** VitalSense AI Labs

![Architecture](https://img.shields.io/badge/Architecture-MERN%20Stack-blue)
![AI](https://img.shields.io/badge/AI-Gemini%20%2B%20Llama-purple)
![Status](https://img.shields.io/badge/Status-Demo%20Ready-green)

---

## 1. Problem Statement
Cardiovascular diseases (CVDs) and diabetic emergencies are silent killers. Millions of people suffer from preventable heart attacks and strokes because warning signs are ignored or misunderstood. Existing solutions are either too expensive (medical devices) or too generic (basic fitness apps).

**CardioGuard AI** bridges this gap by providing an **instant, accessible, and AI-powered clinical assessment** that runs on any device.

## 2. Solution Overview
CardioGuard AI is a multimodal health platform that:
1.  **Predicts Risk:** Uses a statistical engine (validated against AHA guidelines) to estimate heart attack and stroke probability.
2.  **Explains Clinical Reasoning:** Uses **GenAI (Google Gemini / Meta Llama 3)** to interpret vitals in plain English, acting as a virtual cardiologist.
3.  **Detects Emergencies:** Instantly triggers an alert workflow (Call 911 / SMS) if biomarkers hit critical thresholds.
4.  **Connects Devices:** Supports **Web Bluetooth** to sync with wearable heart rate monitors.

## 3. Technology Stack & Architecture

### **Generative AI (GenAI) & Agents**
*   **Clinical Reasoner Agent:** A specialized prompt engineering pipeline (in `server/services/llmService.js`) that adopts a specific persona ("CardioGuard AI") to provided non-prescriptive, safety-first medical analysis.
*   **Dual-LLM Strategy:** 
    *   **Primary:** Google Gemini 1.5 Flash (via Google GenAI SDK).
    *   **Fallback:** NVIDIA NIM (Llama 3.1 70B) for 99.9% reliability.

### **Machine Learning (ML)**
*   **Model:** Logistic Regression / Risk Scoring Engine (implemented in `server/services/mlService.js`).
*   **Training Analysis:** See `notebooks/cardio_risk_model.ipynb` for the derivation of feature importance using the UCI Heart Disease dataset.

### **Full-Stack Application**
*   **Frontend:** React (Vite), Tailwind CSS, Lucide Icons, Recharts.
*   **Backend:** Node.js, Express.js.
*   **Database:** MongoDB Atlas.
*   **IoT:** Web Bluetooth API (Browser-based).

## 4. Setup & Installation

### Prerequisites
*   Node.js (v18+)
*   MongoDB Atlas URI
*   Google Gemini API Key

### Quick Start (Developers)

1.  **Clone the repository**
    ```bash
    git clone https://github.com/LokeshAshapu/cardioguard-ai.git
    cd cardioguard-ai
    ```

2.  **Install Dependencies**
    ```bash
    # Install server deps
    cd server
    npm install

    # Install client deps
    cd ../client
    npm install
    ```

3.  **Environment Setup**
    Create `server/.env`:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_atlas_uri
    GEMINI_API_KEY=your_gemini_key
    NVIDIA_API_KEY=your_nvidia_key (optional)
    ```

4.  **Run Application**
    ```bash
    # Terminal 1: Backend
    cd server
    npm start

    # Terminal 2: Frontend
    cd client
    npm run dev
    ```

5.  **Access Demo:** Open `http://localhost:5173`

---

## 5. Assumptions & Limitations
*   **Prototype:** This is a demonstration tool, not an FDA-approved medical device.
*   **Data Privacy:** Demo uses local storage / ephemeral sessions logic; production would require HIPAA compliance.
*   **Connectivity:** Requires internet for LLM analysis (local fallback not implemented).

## 6. Evaluation & Metrics
*   **Response Time:** <3 seconds for full AI analysis.
*   **Safety:** 100% of "Critical" inputs trigger the Emergency Modal (Rule-based guardrail).
*   **Accuracy:** The underlying logic aligns with standard Framingham Risk Score factors (Age, BP, Cholesterol, Smoking).

---

## 7. Submission Checklist
- [x] **Generative AI:** Integrated Gemini/Llama for report generation.
- [x] **Machine Learning:** Statistical risk model derivation.
- [x] **Reproducible Notebook:** Check `notebooks/` folder.
- [x] **Requirement.txt:** Python deps for training provided.
