from fastapi import APIRouter, HTTPException, Body
from schemas.incident_schema import IncidentData
from schemas.ai_analysis import AIAnalysisResult, CopilotRequest, CopilotResponse
from services.incident_analysis_engine import IncidentAnalysisEngine
from services.gemini_service import GeminiService
from services.simulation_state import state

router = APIRouter()
analysis_engine = IncidentAnalysisEngine()
gemini_service = GeminiService()

@router.post("/copilot", response_model=CopilotResponse)
async def ask_copilot(request: CopilotRequest):
    """Answers operational questions using Gemini AI."""
    try:
        # Inject global simulation state into context to make the AI super smart about current platform status
        if not request.context:
            request.context = {}
        request.context["active_incident"] = state.active_incident
        request.context["recent_metrics"] = state.metrics_history[-5:] if state.metrics_history else []
        request.context["recent_logs"] = state.logs_history[-5:] if state.logs_history else []
        
        return await gemini_service.ask_copilot(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from datetime import datetime

@router.post("/analyze", response_model=AIAnalysisResult)
async def analyze_incident(incident: dict = Body(..., description="The structured incident telemetry to analyze")):
    """
    Passes the structured incident into the Gemini AI engine for Root Cause Analysis.
    """
    try:
        inc_data = IncidentData(
            incident_id=incident.get("incident_id") or incident.get("id", "UNKNOWN"),
            website=incident.get("service_name", "UNKNOWN"),
            service_name=incident.get("service_name", "UNKNOWN"),
            response_time=incident.get("response_time", 0.0),
            uptime_status="down" if incident.get("severity") == "CRITICAL" else "degraded",
            ssl_status="valid",
            severity=incident.get("severity", "INFO"),
            anomaly_score=incident.get("anomaly_score", 0.5),
            timestamps=[datetime.now()],
            telemetry_source="synthetic",
            impacted_services=incident.get("impacted_services", []),
            anomaly_reasoning=incident.get("anomaly_reasoning", [])
        )
        return await analysis_engine.analyze(inc_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
