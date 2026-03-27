import pdfplumber
import re
import io

class ClinicalExtractor:
    @staticmethod
    def extract_from_pdf(pdf_bytes: bytes):
        text = ""
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            for page in pdf.pages:
                text += page.extract_text() + "\n"
        
        return ClinicalExtractor.parse_clinical_data(text), text

    @staticmethod
    def parse_clinical_data(text: str):
        # Case insensitive regex for common clinical indicators
        data = {
            "glucose": ClinicalExtractor._find_value(text, r"Glucose[:\s]+(\d+)"),
            "blood_pressure": ClinicalExtractor._find_bp(text),
            "cholesterol": ClinicalExtractor._find_value(text, r"Cholesterol[:\s]+(\d+)"),
            "age": ClinicalExtractor._find_value(text, r"Age[:\s]+(\d+)"),
            "weight": ClinicalExtractor._find_value(text, r"Weight[:\s]+(\d+)"),
            "bmi": ClinicalExtractor._find_value(text, r"BMI[:\s]+([\d\.]+)"),
            "post_surgery": True if re.search(r"(surgery|cardiac|plastic|heart|bypass|stent)", text, re.IGNORECASE) else False,
            "surgery_details": "History of Cardiovascular Surgery / Prior Procedures" if re.search(r"(cardiac|heart|bypass|stent)", text, re.IGNORECASE) else "None"
        }
        
        # Clean up values (defaults if not found)
        # Handle bools/strings separately
        cleaned = {}
        for k, v in data.items():
            if k in ["glucose", "blood_pressure", "cholesterol", "age", "weight", "bmi"]:
                cleaned[k] = float(v) if v else None
            else:
                cleaned[k] = v
                
        return cleaned

    @staticmethod
    def _find_value(text, pattern):
        match = re.search(pattern, text, re.IGNORECASE)
        return match.group(1) if match else None

    @staticmethod
    def _find_bp(text):
        # Specific pattern for Systolic/Diastolic like 140/90
        match = re.search(r"BP[:\s]*(\d+)[/\s]*(\d+)", text, re.IGNORECASE)
        if match:
            # For simplicity, we'll return systolic
            return match.group(1)
        return None
