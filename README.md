# CareIntel AI – Explainable and Ethical Clinical Decision Support System

CareIntel AI is a production-level full-stack healthcare web application designed for doctors to analyze patient medical reports with full algorithmic transparency and ethical justification.

![CareIntel AI Dashboard](care_intel_hero_dashboard_1773901683894.png)

## 🎯 Core Features
- **PDF Processing**: Automatic extraction of clinical indicators (Glucose, BP, Cholesterol, Age) from medical reports.
- **Explainable AI (XAI)**: Rule-based hybrid diagnosis logic with 100% decision traceability.
- **Ethical Engine**: Automated safety, fairness, and bias audits for every clinical recommendation.
- **Forecast Engine**: Recharts-powered 7-day health risk improvement prediction.
- **Transparency Audit**: Full breakdown of feature importance and model decision workflows.

## 🛠 Tech Stack
- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Lucide Icons, Recharts.
- **Backend**: FastAPI (Python), PDFPlumber, Scikit-Learn.
- **AI**: Modular Clinical Pipeline (Rule-based Hybrid + Predictive Models).

## 📂 Project Structure
```text
/backend
├── engine/             # AI Pipeline (PDF, Diagnosis, Ethics)
├── main.py             # FastAPI App & Endpoints
└── requirements.txt    # Python Dependencies

/frontend
├── app/                # Next.js Pages (Dashboard, Analyze, etc.)
├── components/         # Reusable UI Components
├── tailwind.config.js  # Professional Theme Config
└── package.json        # JS Dependencies
```

## 🚀 Installation & Setup

### 1. Backend Setup
1. Open a terminal and navigate to `/backend`.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the server:
   ```bash
   python main.py
   ```
   *The API will run at `http://localhost:8000`.*

### 2. Frontend Setup
1. Open another terminal and navigate to `/frontend`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   *The app will be available at `http://localhost:3000`.*

## 🧪 Testing the System
1. Go to the **Analyze** page.
2. Upload a sample PDF report (or any PDF for simulation).
3. Observe the:
   - **Diagnosis Section** (Condition detection)
   - **Risk Score** (Red pressure bar)
   - **Ethical AI Validation** (Safety/Fairness/Bias audit)
   - **Bullet Point Reasoning** (Medical justification)

---
*Disclaimer: This is an AI-assisted recommendation system. Final clinical decisions must be validated by a licensed medical professional.*
