class DiagnosisEngine:
    @staticmethod
    def analyze(clinical_data: dict):
        diagnosis = []
        reasoning = []
        risk_score = 0
        
        # High Risk Context Check (Age > 60 + Surgery)
        age = clinical_data.get("age", 45)
        if age > 60 and clinical_data.get("post_surgery"):
            diagnosis.append("Complex Post-Surgical High Risk")
            surgery_ctx = clinical_data.get("surgery_details", "Prior invasive procedures")
            reasoning.append(f"Elderly patient ({age}) with history of {surgery_ctx} requires aggressive prophylactic maintenance.")
            risk_score += 45
        
        # 1. Glucose Check -> Diabetes
        glucose = clinical_data.get("glucose")
        if glucose:
            if glucose >= 126:
                diagnosis.append("Type 2 Diabetes")
                reasoning.append(f"High glucose level ({glucose} mg/dL) exceeds threshold for diabetes diagnosis (>= 126 mg/dL).")
                risk_score += 40
            elif glucose >= 100:
                diagnosis.append("Prediabetes")
                reasoning.append(f"Elevated glucose ({glucose} mg/dL) indicates prediabetes risk.")
                risk_score += 20
        
        # 2. BP Check -> Hypertension
        bp = clinical_data.get("blood_pressure")
        if bp:
            if bp >= 140:
                diagnosis.append("Hypertension")
                reasoning.append(f"Elevated systolic BP ({bp} mmHg) indicates hypertension status.")
                risk_score += 30
            elif bp >= 130:
                diagnosis.append("Stage 1 Hypertension")
                reasoning.append(f"Systolic BP ({bp} mmHg) is in the stage 1 hypertension range.")
                risk_score += 15

        # 3. Cholesterol Check -> Cardiovascular Risk
        cholesterol = clinical_data.get("cholesterol")
        if cholesterol:
            if cholesterol >= 240:
                diagnosis.append("Cardiovascular Risk")
                reasoning.append(f"Total cholesterol ({cholesterol} mg/dL) is high, increasing heart disease risk.")
                risk_score += 25
            elif cholesterol >= 200:
                reasoning.append(f"Cholesterol ({cholesterol} mg/dL) is borderline high.")
                risk_score += 10
        
        # Default if everything is fine
        if not diagnosis:
            diagnosis.append("Stable (Prophylactic Status)")
            reasoning.append("Clinical indicators are currenty stable, but prophylactic maintenance is required for long-term safety.")
            risk_score = 10

        # Cap risk score at 100
        risk_score = min(risk_score, 100)
        
        return {
            "diagnosis": diagnosis,
            "reasoning": reasoning,
            "risk_score": float(risk_score)
        }
