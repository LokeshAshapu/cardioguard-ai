# CardioGuard AI — Early Warning System for Heart Attack, Stroke & Diabetic Emergency

**Project Title:** CardioGuard AI — Early Warning System for Heart Attack, Stroke & Diabetic Emergency

**Team:** [Your Team Name]

**One-line Pitch:** A GenAI-driven platform that predicts imminent cardiovascular and diabetic emergencies using multimodal health data and clinical reasoning, then delivers clear, actionable alerts and first-response instructions.

---

## 1. Abstract

CardioGuard AI is a rapid-deployment, judge-ready hackathon project that combines lightweight predictive ML models, an LLM-based clinical reasoning layer, and a rules-based medical guideline engine to identify high-risk heart attack, stroke, and diabetic emergency events. The system aggregates user inputs from manual entry, wearables, and uploaded ECG images to compute probability scores, explain causes in plain language, and trigger emergency alerts (notifications to contacts and nearest hospitals). Designed for easy demo, high social impact, and straightforward deployment.

---

## 2. Problem Statement

Cardiovascular diseases (CVDs), stroke, and diabetic emergencies are among the leading causes of mortality worldwide. Early recognition of warning signs and fast action significantly reduce morbidity and mortality. However, real-time, personalized early-warning systems that combine clinical reasoning with continuous and sporadic data remain scarce for general consumers.

**Hackathon Goal:** Build a working prototype that demonstrates accurate risk prediction, clear guidance, and a reliable emergency alert pathway within the hackathon timeframe.

---

## 3. Objectives

1. Design a simple, secure web app to collect multimodal health inputs (vitals, symptoms, ECG image, wearable data).
2. Implement a predictive ML model to estimate short-term (hours–days) risk for heart attack, stroke, and diabetic shock.
3. Integrate an LLM for clinical explanation and stepwise guidance.
4. Build an emergency alert system (SMS/WhatsApp + show nearest hospitals).
5. Prepare a concise demo, documentation, and slide deck for judges.

---

## 4. Scope & Assumptions

* Prototype-level model (not for clinical use) — includes disclaimers.
* Uses synthetic / publicly available datasets for model training or pre-trained lightweight models to simulate predictions.
* Focus on clear, explainable outputs and a compelling demo flow.

---

## 5. Data Sources

* Public datasets for cardiovascular risk (e.g., UCI Heart Disease, MIMIC subset if available under license).
* Simulated ECG images or open-source ECG sample sets for demonstration.
* Wearable data simulated via CSV upload or real-time Web Bluetooth (optional).

> Note: For hackathons, synthetic or anonymized public data is acceptable. Always include explicit disclaimers about clinical limitations.

---

## 6. System Overview (High-Level)

1. **Frontend (React + Tailwind)** — Data entry forms, ECG upload, live transcript of LLM explanation, risk dashboard, emergency modal.
2. **Backend (Node.js + Express)** — API endpoints for prediction, LLM prompts, ECG image upload, auth, and emergency triggers.
3. **ML Layer** — Lightweight ML model (XGBoost / LightGBM / logistic regression) for risk probabilities.
4. **LLM Layer** — GPT-4o-mini / similar for reasoning, explanation, and context-aware instructions.
5. **Rules Engine** — Encodes AHA, ADA red flags for immediate emergency escalation.
6. **Alert System** — Twilio / WhatsApp Business API for contact notification; Google Maps API for nearest hospitals.
7. **Database (MongoDB / Supabase)** — stores users, records, prediction history, and emergency logs.

---

## 7. Architecture Diagram (Description)

```mermaid
graph TD
    User((User))
    Client[Client (React)]
    Backend[Backend (Node.js/Express)]
    MLServer[ML Model Server/Module]
    LLM[LLM API (OpenAI/Google)]
    Notify[Notification Services (Twilio/WhatsApp)]
    DB[(Database (MongoDB))]
    Wearable[Optional: Wearables]

    User -->|Enters Vitals/Symptoms| Client
    Wearable -->|Syncs Data| Client
    Client -->|POST /predict| Backend
    Backend -->|Request Prediction| MLServer
    MLServer -->|Risk Probabilities| Backend
    Backend -->|Request Explanation| LLM
    LLM -->|Clinical Reasoning| Backend
    Backend -->|Save Record| DB
    Backend -->|Trigger Alert| Notify
    Notify -->|SMS/Message| User
    Backend -->|JSON Response| Client
    Client -->|Display Dashboard| User
```

---

## 8. Predictive Modeling

### Features

* Age, Sex, BMI
* Systolic & Diastolic BP
* Resting Heart Rate
* Blood glucose (fasting/random)
* Cholesterol (TC, HDL, LDL if available)
* Symptoms (binary flags)
* Sleep hours
* Steps/day (activity)
* ECG features: uploaded image processed via small CNN to detect arrhythmia cues (optional)

### Model Design

* **Baseline:** Logistic regression for transparency and quick training.
* **Advanced:** Gradient Boosting (XGBoost / LightGBM) for higher AUC.
* **ECG:** Small CNN to extract features mapped to cardiac risk markers.

### Evaluation Metrics

* ROC AUC, Precision@k, Recall (sensitivity), F1-score.
* For emergency detection, prioritize **high recall** (catch most true emergencies) while controlling false positives with LLM/context rules.

---

## 9. LLM Prompting Strategy

Use the model as a clinical reasoner and explanation generator. Provide structured prompts with context to avoid hallucination. Example prompt template:

```
System: You are a clinical assistant. Use AHA/ADA best-practice checklists and avoid giving prescriptive medication instructions. Use simple language for a general user.

User context:
- Age: 58
- Sex: Male
- BP: 160/100
- HR: 110
- Symptoms: chest pain, sweating
- Model risk prediction: Heart Attack Probability 68%

Task: Explain what these numbers mean in plain language, list urgent steps (3 max), and provide red flag instructions that require immediate hospital visit.
```

Always append a safety disclaimer and encourage seeking medical attention.

---

## 10. Emergency Flow & Alerting

**Thresholds:** Define conservative thresholds (e.g., Heart Attack Probability ≥ 50% or presence of specific red-flag symptoms + BP extremes) to trigger Emergency Mode.

**Emergency Mode Actions:**

1. Display a full-screen emergency modal with clear instructions.
2. Ask for immediate confirmation to call emergency contact (pre-saved).
3. Send SMS/WhatsApp with user summary and location.
4. Show nearest hospitals with directions via Google Maps.

**APIs:** Twilio (SMS), WhatsApp Business API (if available), Google Maps Places & Directions.

---

## 11. UX / UI Design

**Design Principles:** Clarity, urgency, minimal cognitive load, color-coded risk (green/yellow/red/critical).

**Key Screens:**

* Onboarding & profile setup
* Health data entry + wearable connect
* Live prediction dashboard with gauge and %
* LLM explanation pane with "Why" & "What to do now"
* Emergency modal & contact alert flow
* History & trends (past predictions)

**Demo Tips:** Prepare 2–3 user scenarios (low risk, medium risk, emergency) to quickly show system behavior.

---

## 12. API Endpoints (Example)

```
POST /api/auth/register  --> {name, email, password}
POST /api/auth/login     --> returns JWT
POST /api/predict        --> {userId, vitals, symptoms, ecgImage?}  --> {heartRisk, strokeRisk, diabeticRisk, explanation}
POST /api/emergency      --> {userId, predictionId} --> triggers notifications
GET  /api/history/:userId --> returns past predictions
POST /api/upload-ecg     --> multipart-form-data
```

---

## 13. Database Schemas (Example)

```
users: {
  _id,
  name,
  email,
  phone,
  emergencyContact: {name, phone},
  createdAt
}

health_records: {
  _id,
  userId,
  timestamp,
  vitals: {bpSys, bpDia, hr, glucose, cholesterol},
  symptoms: [],
  ecg_url,
}

predictions: {
  _id,
  recordId,
  heartRiskPct,
  strokeRiskPct,
  diabeticRiskPct,
  llmExplanation,
  emergencyTriggered: boolean,
  createdAt
}

emergency_logs: {
  _id,
  userId,
  predictionId,
  notifiedContacts: [],
  location,
  timestamp
}
```

---

## 14. Deployment Plan

* Frontend: Deploy to Vercel (React).
* Backend: Deploy to Render or Heroku (Node.js).
* ML Model: Deploy as a serverless function or lightweight Flask service.
* Database: MongoDB Atlas or Supabase.
* LLM: OpenAI / Google / Azure APIs (API key in server env).
* Notifications: Twilio account (trial for demo).

---

## 15. Security & Privacy

* Use HTTPS and secure headers.
* JWT-based authentication.
* Encrypt sensitive fields at rest.
* Data minimization and explicit user consent.
* Add clear medical disclaimers; do not present the system as a replacement for professional medical advice.

---

## 16. Ethics & Regulatory Notes

* This prototype is for demonstration only. It is **not** a medical device.
* Include a visible disclaimer on every page and during demo.
* If extending beyond hackathon, consult institutional review boards (IRB) and regulatory guidance (FDA/CE) for clinical tools.

---

## 17. Evaluation Metrics for Hackathon Judges

* **Impact:** Number of emergency scenarios correctly flagged in demo scripts.
* **Accuracy:** Model AUC on held-out test set (show numeric).
* **Explainability:** Quality of LLM explanations and clinician-readability.
* **UX:** Time-to-action in emergency scenario (how quickly alerts are sent).
* **Scalability:** Clear deployment path and cost estimates.

---

## 18. Demo Script (3-minute flow)

1. **Intro (15s):** Explain problem & one-line solution.
2. **Low-Risk Demo (30s):** Enter vitals → show green result + lifestyle suggestions.
3. **Medium-Risk Demo (45s):** Enter abnormal vitals → show yellow + follow-up advice.
4. **Emergency Demo (60s):** Input red-flag vitals or use pre-recorded ECG → trigger Emergency Mode, send SMS (mocked if needed), show maps.
5. **Closing (30s):** Show architecture slide and future enhancements.

---

## 19. Team Roles (Suggested)

* ML Engineer: Model training & evaluation.
* Backend Engineer: APIs & LLM integration.
* Frontend Engineer: React UI & Web Bluetooth.
* Product/UX Designer: Mockups and demo flow.
* Domain Consultant (optional): Medical student / clinician reviewer.

---

## 20. Future Work & Roadmap

* Integrate real-time wearables (Apple Watch, Fitbit).
* Continuous monitoring with edge models on-device.
* Clinical validation with partner hospitals.
* Extend to full cardiovascular monitoring (arrhythmia detection, long-term trend analysis).

---

## 21. Appendix

### A. Example LLM Prompt (System + User)

```
System: You are a clinical assistant. Use non-prescriptive language. Provide stepwise guidance and prioritize emergency actions.

User context: {age, sex, vitals, symptoms, model_scores}

Task: Produce: 1) Plain-language interpretation 2) Top 3 immediate actions 3) Red flags requiring hospital 4) Recommended tests (non-prescriptive).
```

### B. Quick Checklist Before Demo

* Set Twilio trial number and mock emergency contact.
* Seed the database with sample users for the 3 scenarios.
* Ensure LLM API keys are set in backend environment.
* Prepare screenshot/recording if live connectivity is unreliable.

---

**End of Document**

---

# STEP 4 — UI SCREENS (High-fidelity + Component Library + JSX Snippets)

Below are **high-fidelity UI screen descriptions**, a component inventory, Tailwind-ready design tokens, and copy-paste-ready React component skeletons (with Tailwind classes) to speed implementation. Use these for Figma mockups or to implement directly in your React app.

---

## 1) Design System (Tokens)

**Color Palette**

* Primary: `#0F62FE` (deep blue) — actions
* Accent: `#00B894` (green) — safe/positive
* Warning: `#FFB020` (amber) — caution
* Danger: `#FF4D4F` (red) — critical
* UI Surface: `#FFFFFF` / `#0F172A` (dark mode)
* Muted text: `#6B7280`

**Typography**

* Headline: `Inter` 700, 32–40px
* Subhead: `Inter` 600, 18–24px
* Body: `Inter` 400, 14–16px
* Monospace for vitals: `Roboto Mono` 14px

**Spacing & Layout**

* Base spacing: 8px (use Tailwind scale)
* Container widths: `max-w-4xl` for dashboard, `max-w-2xl` for forms

**Icons & Illustrations**

* Use Heroicons (outline) for actions (record, upload, alert) and custom SVG for risk gauge

---

## 2) Key Screens (Descriptions + Purpose)

### A. Landing / Hero

* Short pitch, CTA button “Check my risk” and a small demo video/animated gauge.
* Quick links: How it works, Demo scenarios, Team

### B. Onboarding / Profile Setup

* Ask for name, DOB, emergency contact, and basic health profile (existing conditions, meds).
* Save emergency contact for alerts.

### C. Health Data Entry (Core Input Screen)

* Left: form (age, sex, weight/height, vitals, symptoms list, upload ECG)
* Right: quick tips + emergency toggle + recent history quick-view
* Primary CTA: `Analyze Risk` (prominent)

### D. AI Risk Dashboard (Core Output Screen)

* Top: Risk Gauge (heart icon) showing Heart Risk % (big)
* Cards: Stroke Risk %, Diabetic Emergency %
* LLM Explanation panel: "Why this score" (collapsible)
* Action Buttons: `Emergency Mode`, `Share Report`, `Save`
* Trend sparkline showing risk over last n entries

### E. Detailed Insights Page

* LLM-generated plain-language explanation + 3 immediate actions + tests to get.
* Section: "What changed since last test" (delta vitals)
* Links to nearest hospitals and contact buttons

### F. Emergency Modal (Full-screen urgent flow)

* Red full-screen modal with 3-step quick actions: Call Emergency Contact, Call Ambulance, Show Nearest Hospital Directions
* Confirm to send SMS/WhatsApp — shows a mock preview of message being sent

### G. History / Trends

* Table of previous predictions, filters, export CSV / PDF of report

---

## 3) Component Inventory (Files & Responsibilities)

```
/components
  /Auth
    Login.jsx
    Register.jsx
  /Common
    Header.jsx
    Footer.jsx
    RiskGauge.jsx
    Sparkline.jsx
    Button.jsx
    Modal.jsx
    RiskBadge.jsx
  /Dashboard
    DataEntryForm.jsx
    PredictionCard.jsx
    LLMExplanation.jsx
    EmergencyModal.jsx
  /Profile
    ProfileForm.jsx
  /Pages
    Landing.jsx
    DashboardPage.jsx
    InsightsPage.jsx
    HistoryPage.jsx
```

---

## 4) Ready-to-use React + Tailwind Snippets

### RiskGauge.jsx (Gauge + Percentage)

```jsx
export default function RiskGauge({value, label}){
  const color = value < 30 ? 'bg-green-500' : value < 60 ? 'bg-amber-400' : 'bg-red-500'
  return (
    <div className="flex items-center gap-4">
      <div className="w-36 h-36 rounded-full bg-gradient-to-br from-white/60 to-white/10 flex items-center justify-center shadow-lg">
        <div className="text-center">
          <div className={`text-4xl font-bold ${value<60 ? 'text-black' : 'text-white'}`}>{value}%</div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
      </div>
      <div className="flex-1">
        <div className="text-sm text-gray-600">Interpretation</div>
        <div className="mt-2 text-base">{value < 30 ? 'Low' : value < 60 ? 'Moderate' : 'High'}</div>
      </div>
    </div>
  )
}
```

### DataEntryForm.jsx (Core fields + ECG upload)

```jsx
import {useState} from 'react'
export default function DataEntryForm({onSubmit}){
  const [form, setForm] = useState({age:'', sex:'male', bpSys:'', bpDia:'', hr:'', glucose:'', symptoms:[]})
  return (
    <form onSubmit={(e)=>{e.preventDefault(); onSubmit(form)}} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input required placeholder="Age" value={form.age} onChange={e=>setForm({...form, age:e.target.value})} className="input" />
        <select value={form.sex} onChange={e=>setForm({...form, sex:e.target.value})} className="input">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <input placeholder="BP Systolic" value={form.bpSys} onChange={e=>setForm({...form,bpSys:e.target.value})} className="input"/>
        <input placeholder="BP Diastolic" value={form.bpDia} onChange={e=>setForm({...form,bpDia:e.target.value})} className="input"/>
        <input placeholder="Heart Rate" value={form.hr} onChange={e=>setForm({...form,hr:e.target.value})} className="input"/>
      </div>

      <div>
        <label className="block text-sm font-medium">Symptoms (select)</label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {["Chest pain","Dizziness","Sweating","Shortness of breath"].map(s=> (
            <label key={s} className="inline-flex items-center gap-2">
              <input type="checkbox" onChange={(e)=>{/*update symptoms*/}} />
              <span className="text-sm">{s}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Upload ECG (optional)</label>
        <input type="file" accept="image/*,.pdf" className="mt-2" />
      </div>

      <div className="flex gap-2">
        <button className="px-4 py-2 rounded bg-blue-600 text-white">Analyze Risk</button>
        <button type="button" className="px-4 py-2 border rounded">Save Draft</button>
      </div>
    </form>
  )
}
```

### EmergencyModal.jsx (Full-screen modal)

```jsx
export default function EmergencyModal({open, onClose, onCall, onNotify}){
  if(!open) return null
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-xl w-full shadow-lg">
        <h2 className="text-xl font-bold text-red-600">EMERGENCY — Immediate Action Required</h2>
        <p className="mt-2">We recommend calling emergency services now. We can also notify your emergency contact.</p>
        <div className="mt-4 flex gap-2">
          <button onClick={onCall} className="flex-1 bg-red-600 text-white px-4 py-2 rounded">Call Ambulance</button>
          <button onClick={onNotify} className="flex-1 border px-4 py-2 rounded">Notify Contact</button>
          <button onClick={onClose} className="px-4 py-2">Dismiss</button>
        </div>
      </div>
    </div>
  )
}
```
