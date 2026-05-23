from schemas.incident_schema import IncidentData
from schemas.ai_analysis import AIAnalysisResult
from services.gemini_service import GeminiService
from services.remediation_engine import RemediationEngine
from services.incident_explainer import IncidentExplainer

class IncidentAnalysisEngine:
    def __init__(self):
        self.gemini = GeminiService()
        self.remediation = RemediationEngine()
        self.explainer = IncidentExplainer()

    async def analyze(self, incident: IncidentData) -> AIAnalysisResult:
        """
        Orchestrates the AI root cause analysis phase.
        """
        # 1. Fetch raw RCA from Gemini
        analysis = await self.gemini.analyze_incident(incident)
        
        # 2. Process and prioritize remediations
        analysis = self.remediation.prioritize_fixes(analysis)
        
        # 3. Format the explanation
        analysis.explanation = self.explainer.format_explanation(analysis)
        
        return analysis
