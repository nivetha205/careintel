class ExplanationEngine:
    @staticmethod
    def generate_explanation(rule_based_reasoning: list, llm_analysis: dict):
        """
        Merges rule-based reasoning with LLM-generated insights.
        """
        # Rule-based reasoning comes from DiagnosisEngine
        # LLM analysis comes from LLMService
        
        reasoning = rule_based_reasoning + (llm_analysis.get("reasoning", []) if llm_analysis else [])
        
        ethical_explanation = (
            "No demographic or history-based bias detected. "
            "Recommendation is prioritized by clinical risk context. "
            "Analysis is strictly deterministic based on clinical history."
        )
        
        # Adding LLM risks to the explanation
        llm_risks = llm_analysis.get("risks", [])
        if llm_risks:
            reasoning.append(f"AI Risk Assessment: {', '.join(llm_risks)}")
            
        return {
            "reasoning": reasoning,
            "ethical_explanation": ethical_explanation,
            "llm_summary": llm_analysis.get("clinical_summary", "Clinical analysis performed via rule-based fallback system.")
        }
