from schemas.ai_analysis import AIAnalysisResult

class RemediationEngine:
    def prioritize_fixes(self, analysis: AIAnalysisResult) -> AIAnalysisResult:
        """
        Sorts and filters the AI-suggested fixes to highlight immediate actions.
        """
        priority_order = {"immediate": 0, "short-term": 1, "long-term": 2}
        analysis.suggested_fixes.sort(key=lambda x: priority_order.get(x.priority.lower(), 99))
        return analysis
