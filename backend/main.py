from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import json
import os

# Import engine modules
from engine.pdf_processor import ClinicalExtractor
from engine.diagnosis import DiagnosisEngine
from engine.ethics import EthicalEngine
from engine.recommendation import RecommendationEngine

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

@app.get("/")
async def root():
    return {"status": "CareIntel AI API is running"}

@app.post("/upload-report")
async def analyze_report(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    try:
        contents = await file.read()
        clinical_data = ClinicalExtractor.extract_from_pdf(contents)
        diagnosis_result = DiagnosisEngine.analyze(clinical_data)
        rec_result = RecommendationEngine.recommend(diagnosis_result["diagnosis"])
        
        # Ethical Analysis
        ethical_analysis = EthicalEngine.analyze_ethics(
            clinical_data, 
            diagnosis_result["diagnosis"], 
            rec_result["perfect_choice"]["name"]
        )
        
        return {
            "diagnosis": diagnosis_result["diagnosis"],
            "risk_score": diagnosis_result["risk_score"],
            "medication_options": rec_result["top_3_options"],
            "perfect_choice": rec_result["perfect_choice"],
            "reasoning": diagnosis_result["reasoning"],
            "ethical_analysis": ethical_analysis,
            "extracted_data": clinical_data
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

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
