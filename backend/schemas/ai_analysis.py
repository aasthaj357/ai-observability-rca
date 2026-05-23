from pydantic import BaseModel
from typing import List, Optional

class AIRemediation(BaseModel):
    action: str
    description: str
    priority: str # "immediate", "short-term", "long-term"
    estimated_impact: str

class AIAnalysisResult(BaseModel):
    incident_id: str
    root_cause: str
    severity: str
    impacted_services: List[str]
    suggested_fixes: List[AIRemediation]
    confidence_score: float # 0.0 to 1.0
    explanation: str
    evidence: List[str]
    recommended_priority: str

class CopilotRequest(BaseModel):
    message: str
    context: Optional[dict] = None # Passes active incident context

class CopilotResponse(BaseModel):
    answer: str
    suggested_actions: List[str] = []
