class RecommendationEngine:
    @staticmethod
    def recommend(diagnosis: list):
        options = []
        
        # Comprehensive Medication Mapping
        diagnosis_str = " ".join(diagnosis).lower()
        
        # Diabetes logic
        if "diabetes" in diagnosis_str or "prediabetes" in diagnosis_str:
            options.extend([
                {"name": "Metformin (Glucophage)", "effectiveness": "Gold Standard", "projection": [85, 82, 80, 78, 75, 74, 72, 70], "reasoning": "First-line oral therapy for glycemic control."},
                {"name": "Tirzepatide (Mounjaro)", "effectiveness": "Very High", "projection": [85, 78, 65, 50, 42, 35, 30, 25], "reasoning": "Dual GIP/GLP-1 receptor agonist for weight and glucose."},
                {"name": "Semaglutide (Ozempic)", "effectiveness": "High", "projection": [85, 80, 72, 60, 52, 45, 40, 38], "reasoning": "GLP-1RA with significant CV benefit."}
            ])
        
        # Hypertension logic (including Stage 1)
        if "hypertension" in diagnosis_str:
            options.extend([
                {"name": "Lisinopril (Zestril)", "effectiveness": "Optimal", "projection": [70, 68, 65, 63, 60, 58, 56, 55], "reasoning": "ACE inhibitor for blood pressure and renal health."},
                {"name": "Amlodipine (Norvasc)", "effectiveness": "High", "projection": [70, 65, 60, 55, 50, 48, 45, 42], "reasoning": "Calcium channel blocker for vascular resistance."},
                {"name": "Valsartan/HCTZ", "effectiveness": "Very High", "projection": [70, 60, 52, 45, 38, 32, 28, 25], "reasoning": "Combination therapy for treatment-resistant HTN."}
            ])

        # High Risk Context
        if "surgical" in diagnosis_str or "risk" in diagnosis_str:
            options.extend([
                {"name": "Rosuvastatin (Crestor)", "effectiveness": "Very High", "projection": [45, 35, 30, 25, 20, 18, 16, 15], "reasoning": "High-intensity statin for cardiovascular prevention."},
                {"name": "Atorvastatin (Lipitor)", "effectiveness": "High", "projection": [45, 38, 32, 28, 24, 22, 20, 18], "reasoning": "Potent lipid-lowering with established safety profile."}
            ])
            
        # Guarantee non-empty options with defaults
        if not options:
            options = [
                {"name": "Vitamin D3 + Omega-3", "effectiveness": "Maintenance", "projection": [10, 10, 10, 9, 9, 9, 9, 9], "reasoning": "Basic metabolic and cardiovascular support."},
                {"name": "Ubiquinol (CoQ10)", "effectiveness": "Stabilizing", "projection": [10, 10, 9, 9, 8, 8, 8, 8], "reasoning": "Supports mitochondrial function and heart health."},
                {"name": "Folic Acid / B12", "effectiveness": "Prophylactic", "projection": [10, 9, 8, 7, 7, 7, 7, 7], "reasoning": "Essential micronutrient profile for general review."}
            ]
            
        # Return unique options (up to top 3)
        seen = set()
        unique_options = []
        for opt in options:
            if opt["name"] not in seen:
                seen.add(opt["name"])
                unique_options.append(opt)
                
        return {
            "top_3_options": unique_options[:3],
            "perfect_choice": unique_options[0] if unique_options else None
        }
