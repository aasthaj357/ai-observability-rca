from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
from schemas.telemetry import TelemetryData

class IncidentData(BaseModel):
    incident_id: Optional[str] = None
    id: Optional[str] = None
    title: Optional[str] = None
    status: Optional[str] = None
    time_relative: Optional[str] = None
    timeAgo: Optional[str] = None
    start_time: Optional[str] = None
    website: Optional[str] = None
    service_name: str
    endpoint: Optional[str] = None
    response_time: float
    latency_spike: bool = False
    error_rate: float = 0.0
    cpu_usage: Optional[float] = None
    memory_usage: Optional[float] = None
    status_code: Optional[int] = None
    uptime_status: Optional[str] = None
    ssl_status: Optional[str] = None
    suspicious_logs: List[str] = []
    alerts: List[Dict[str, Any]] = []
    deployment_events: List[Dict[str, Any]] = []
    impacted_services: List[str] = []
    severity: str # "low", "medium", "high", "critical"
    anomaly_score: float # 0.0 to 1.0
    anomaly_reasoning: List[str] = []
    timestamps: Optional[List[datetime]] = None
    telemetry_source: Optional[str] = None
    raw_telemetry: List[TelemetryData] = []
