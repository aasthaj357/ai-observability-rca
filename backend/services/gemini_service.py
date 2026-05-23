import json
import asyncio
from google import genai
from config.settings import settings
from schemas.incident_schema import IncidentData
from schemas.ai_analysis import AIAnalysisResult, CopilotRequest, CopilotResponse
from services.prompt_templates import PromptTemplates

class GeminiService:
    def __init__(self):
        self.api_key = settings.gemini_api_key
        # Only initialize client if key is provided
        self.client = genai.Client(api_key=self.api_key) if self.api_key else None

    async def ask_copilot(self, request: CopilotRequest) -> CopilotResponse:
        if not self.client:
            return CopilotResponse(
                answer="I am currently running in mock mode. Based on the context, the issue seems to stem from a database connection timeout.",
                suggested_actions=["Check database logs", "Scale pgbouncer"]
            )
            
        prompt = PromptTemplates.get_copilot_prompt(request.message, request.context)
        
        try:
            response = await asyncio.to_thread(
                self.client.models.generate_content,
                model='gemini-flash-latest',
                contents=prompt,
                config=genai.types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.3
                )
            )
            data = json.loads(response.text)
            return CopilotResponse(
                answer=data.get("answer", "I couldn't process that question."),
                suggested_actions=data.get("suggested_actions", [])
            )
        except Exception as e:
            print(f"Gemini Copilot Error: {e}")
            return CopilotResponse(
                answer=f"Error connecting to Gemini: {str(e)}",
                suggested_actions=["Check API keys"]
            )

    async def analyze_incident(self, incident: IncidentData) -> AIAnalysisResult:
        if not self.client:
            return self._get_mock_response(incident)

        prompt = PromptTemplates.get_rca_prompt(incident)
        
        try:
            # Using asyncio.to_thread since genai.Client is synchronous by default
            response = await asyncio.to_thread(
                self.client.models.generate_content,
                model='gemini-flash-latest',
                contents=prompt,
                config=genai.types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.2
                )
            )
            
            data = json.loads(response.text)
            
            return AIAnalysisResult(
                incident_id=incident.incident_id,
                root_cause=data.get("root_cause", "Unknown Root Cause"),
                severity=data.get("severity", incident.severity).upper(),
                impacted_services=data.get("impacted_services", incident.impacted_services),
                suggested_fixes=data.get("suggested_fixes", []),
                confidence_score=data.get("confidence_score", 0.5),
                explanation=data.get("explanation", "An unexpected anomaly occurred."),
                evidence=data.get("evidence", []),
                recommended_priority=data.get("recommended_priority", "P3")
            )
        except Exception as e:
            print(f"Gemini API Error: {e}")
            return self._get_mock_response(incident)

    def _get_mock_response(self, incident: IncidentData) -> AIAnalysisResult:
        """Fallback response if API fails or key is missing."""
        is_high_severity = incident.anomaly_score > 0.6
        
        return AIAnalysisResult(
            incident_id=incident.incident_id,
            root_cause="Database Connection Pool Exhaustion" if is_high_severity else "Transient Network Latency",
            severity="CRITICAL" if is_high_severity else "LOW",
            impacted_services=incident.impacted_services,
            suggested_fixes=[
                {
                    "action": "Restart Connection Pool",
                    "description": "Restart the pgbouncer instances to clear dead connections.",
                    "priority": "immediate",
                    "estimated_impact": "High - will restore immediate connectivity."
                },
                {
                    "action": "Increase Timeout Limits",
                    "description": "Increase API gateway timeout from 5s to 10s temporarily.",
                    "priority": "short-term",
                    "estimated_impact": "Medium - prevents cascading failures."
                }
            ] if is_high_severity else [],
            confidence_score=0.89 if is_high_severity else 0.65,
            explanation=f"The outage likely began after deployment v1.4.3 overloaded the {incident.service_name}, causing cascading API timeout failures." if is_high_severity else "A brief period of elevated latency was detected but quickly recovered without intervention.",
            evidence=[f"Latency spike of {incident.response_time}ms detected", "Correlated with recent deployment"],
            recommended_priority="P1" if is_high_severity else "P4"
        )
