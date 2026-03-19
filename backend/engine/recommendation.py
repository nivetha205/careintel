class RecommendationEngine:
    @staticmethod
    def recommend(diagnosis: list):
        options = []
        
        # Diabetes logic (Expanding DB)
        if "Type 2 Diabetes" in diagnosis or "Prediabetes" in diagnosis:
            options.append({
                "name": "Metformin (Standard Care)",
                "effectiveness": "Moderate",
                "projection": [85, 82, 80, 78, 75, 74, 72, 70],
                "reasoning": "Standard first-line therapy with long-term safety data."
            })
            options.append({
                "name": "Tirzepatide (Modern Dual GIP/GLP-1)",
                "effectiveness": "Very High",
                "projection": [85, 78, 65, 50, 42, 35, 30, 25],
                "reasoning": "Top-tier modern medication for rapid glycemic control and metabolic improvement."
            })
            options.append({
                "name": "Semaglutide (Modern GLP-1RA)",
                "effectiveness": "High",
                "projection": [85, 80, 72, 60, 52, 45, 40, 38],
                "reasoning": "Proven cardiovascular benefits in addition to glucose lowering."
            })
        
        # HTN logic (Expanding DB)
        elif "Hypertension" in diagnosis:
            options.append({
                "name": "Lisinopril (ACE Inhibitor)",
                "effectiveness": "Moderate",
                "projection": [70, 68, 65, 63, 60, 58, 56, 55],
                "reasoning": "Effective blood pressure reduction and kidney protection."
            })
            options.append({
                "name": "Amlodipine (Calcium Channel Blocker)",
                "effectiveness": "High",
                "projection": [70, 65, 60, 55, 50, 48, 45, 42],
                "reasoning": "Potent vasodilator with once-daily dosing."
            })
            options.append({
                "name": "Single-Pill Combo (Modern HTN Care)",
                "effectiveness": "Very High",
                "projection": [70, 60, 52, 45, 38, 32, 28, 25],
                "reasoning": "Combination therapy (e.g. Telmisartan/Amlodipine) minimizes pill burden and maximizes efficacy."
            })

        # High Risk Prophylaxis (New)
        if "Complex Post-Surgical High Risk" in diagnosis:
            options.append({
                "name": "Low-Dose Aspirin (Post-Cardiac Prophylaxis)",
                "effectiveness": "High (Preventive)",
                "projection": [45, 42, 40, 38, 36, 35, 34, 33],
                "reasoning": "Essential for secondary prevention in patients with cardiovascular surgical history."
            })
            options.append({
                "name": "Coenzyme Q10 (Cardiac Metabolic Support)",
                "effectiveness": "Moderate",
                "projection": [45, 44, 43, 42, 41, 40, 39, 38],
                "reasoning": "Supports myocardial bioenergetics in recovery phases."
            })
            options.append({
                "name": "Rosuvastatin (Aggressive Lipid Management)",
                "effectiveness": "Very High",
                "projection": [45, 35, 30, 25, 20, 18, 16, 15],
                "reasoning": "Standard of care for high-risk elderly surgical patients to prevent future events."
            })

        # Default falling (Serious Maintenance)
        if not options:
            options = [
                {"name": "Multivitamin Protocol (Adult Maintenance)", "effectiveness": "Stability", "projection": [10, 10, 10, 9, 9, 9, 9, 9], "reasoning": "Ensures micronutrient baseline for stable profiles."},
                {"name": "Vitamin D3 + K2 (Bone/Immune Support)", "effectiveness": "Prophylactic", "projection": [10, 10, 9, 9, 8, 8, 8, 8], "reasoning": "Proactive support for metabolic bone health."},
                {"name": "CoQ10 + Omega-3 (Cardiac Longevity)", "effectiveness": "High (Maintenance)", "projection": [10, 9, 8, 7, 6, 5, 5, 5], "reasoning": "Preventive cardiovascular structural support."}
            ]
            
        return {
            "top_3_options": options,
            "perfect_choice": options[0] # Maintenance is the primary goal
        }
