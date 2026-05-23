from pydantic import BaseModel, HttpUrl
from typing import Optional, List, Dict, Any
from datetime import datetime

class TelemetryData(BaseModel):
    website: str
    service_name: str
    endpoint: Optional[str] = None
    response_time: float # in milliseconds
    status_code: Optional[int] = None
    uptime_status: str # "up", "down", "degraded"
    ssl_status: str # "valid", "invalid", "expired", "n/a"
    error_logs: List[str] = []
    alerts: List[Dict[str, Any]] = []
    timestamp: datetime
    source: str # "website_monitor", "grafana", "new_relic"
