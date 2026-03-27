class GuidelinesEngine:
    """Simulates a RAG retrieval system for Clinical Guidelines."""
    
    GUIDELINES = {
        "diabetes": [
            "ADA 2024: Metformin is the preferred initial pharmacologic agent for the treatment of type 2 diabetes.",
            "GLP-1 receptor agonists are recommended for patients with established ASCVD or high risk.",
            "Maintain A1C < 7.0% for most non-pregnant adults.",
            "Diabetes Care 2024: Quarterly glucose monitoring required for patients with HbA1c > 8.5%."
        ],
        "hypertension": [
            "ACC/AHA 2017: Stage 1 hypertension is 130-139 / 80-89 mmHg.",
            "ACE inhibitors or ARBs are first-line for patients with CKD or diabetes.",
            "Lifestyle modification (DASH diet, low sodium) is mandatory for BP > 120/80.",
            "JAMA Internal Medicine: Combination therapy with Amlodipine/Lisinopril improves long-term BP stability."
        ],
        "cardiovascular": [
            "High-intensity statin therapy is indicated for patients with LDL >= 190 mg/dL.",
            "Aspirin 81mg daily for secondary prevention in patients with established CVD.",
            "Smoking cessation and regular aerobic exercise (150 min/week).",
            "ESC 2023 Guidelines: Prophylactic statin therapy reduces MACE by 23% in high-risk patients."
        ]
    }

    @classmethod
    def lookup(cls, query: str):
        query = query.lower()
        results = []
        for key, snippets in cls.GUIDELINES.items():
            if key in query:
                results.extend(snippets)
        
        if not results:
            return ["No specific guideline found. Consult general medical reference."]
        
        return results
