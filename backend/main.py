from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import json
import os
import sys

# Ensure current directory is in sys.path for engine imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import engine modules
from engine.pdf_processor import ClinicalExtractor
from engine.diagnosis import DiagnosisEngine
from engine.ethics import EthicalEngine
from engine.recommendation import RecommendationEngine
from services.llm_service import analyze_patient_with_llm

app = FastAPI(title="CareIntel AI - API")

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PATIENTS_FILE = "patients.json"

def get_patients_db():
    if not os.path.exists(PATIENTS_FILE):
        return []
    with open(PATIENTS_FILE, "r") as f:
        return json.load(f)

def save_patients_db(data):
    with open(PATIENTS_FILE, "w") as f:
        json.dump(data, f, indent=2)

def update_patient_history(patient_id, risk_score, diagnosis):
    db = get_patients_db()
    for p in db:
        if p["id"] == patient_id:
            if "history" not in p:
                p["history"] = []
            p["history"].append({
                "date": "Mar 27, 2026",
                "risk_score": risk_score,
                "diagnosis": diagnosis
            })
            save_patients_db(db)
            return True
    return False

@app.get("/")
async def root():
    return {"status": "CareIntel AI API is running"}

from fastapi import Form
@app.post("/upload-report")
@app.post("/full-analysis")
async def analyze_report(
    file: UploadFile = File(...),
    current_meds: str = Form(None),
    lifestyle: str = Form(None)
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    try:
        contents = await file.read()
        clinical_data, raw_text = ClinicalExtractor.extract_from_pdf(contents)
        diagnosis_result = DiagnosisEngine.analyze(clinical_data)
        rec_result = RecommendationEngine.recommend(diagnosis_result["diagnosis"])
        
        # Ethical Analysis
        medicine_name = rec_result.get("perfect_choice", {}).get("name", "Unknown")
        ethical_analysis = EthicalEngine.analyze_ethics(
            clinical_data, 
            diagnosis_result["diagnosis"], 
            medicine_name
        )
        
        # Data Fusion: Parse intake form data
        meds_list = json.loads(current_meds) if current_meds else []
        lifestyle_dict = json.loads(lifestyle) if lifestyle else {}

        # Parallel call to LLM service for deeper clinical insights
        # Pass the extracted raw text to the LLM
        llm_result = await analyze_patient_with_llm(
            raw_text, 
            current_meds=meds_list, 
            lifestyle=lifestyle_dict
        )
        
        return {
            "diagnosis": diagnosis_result["diagnosis"],
            "risk_score": diagnosis_result["risk_score"],
            "medication_options": rec_result["top_3_options"],
            "perfect_choice": rec_result["perfect_choice"],
            "reasoning": diagnosis_result["reasoning"],
            "ethical_analysis": ethical_analysis,
            "extracted_data": clinical_data,
            "llm_analysis": llm_result  # Added llm_result to API response as requested
        }
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/patients")
async def get_patients():
    return get_patients_db()

class NewPatient(BaseModel):
    name: str
    age: int
    diagnosis: str
    risk_score: float
    phone: str

@app.post("/patients")
async def add_patient(patient: NewPatient):
    db = get_patients_db()
    new_p = {
        "id": len(db) + 1,
        "name": patient.name,
        "age": patient.age,
        "diagnosis": patient.diagnosis,
        "risk_score": patient.risk_score,
        "phone": patient.phone,
        "lastVisit": "Mar 19, 2026"
    }
    db.append(new_p)
    save_patients_db(db)
    return new_p

@app.get("/patients/{patient_id}/history")
async def get_patient_history(patient_id: int):
    db = get_patients_db()
    for p in db:
        if p["id"] == patient_id:
            return p.get("history", [])
    raise HTTPException(status_code=404, detail="Patient not found")

class ChatRequest(BaseModel):
    message: str
    patient_text: str
    history: list = []

@app.post("/chat")
async def chat_endpoint(req: ChatRequest):
    from services.llm_service import LLMService
    response = await LLMService.chat_with_patient_context(
        req.patient_text, 
        req.message, 
        req.history
    )
    return {"response": response}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
