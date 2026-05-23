import uuid
from typing import List
from schemas.telemetry import TelemetryData
from schemas.incident_schema import IncidentData

class TelemetryNormalizer:
    def normalize(self, telemetry_list: List[TelemetryData]) -> IncidentData:
        """
        Takes a list of related TelemetryData objects and normalizes them into a single base IncidentData object.
        """
        if not telemetry_list:
            raise ValueError("Empty telemetry list provided for normalization.")

        # For correlation, we assume the list contains telemetry for a single perceived incident/website.
        # We'll use the first item as the primary source for base details.
        primary = telemetry_list[0]
        
        raw_logs = []
        raw_alerts = []
        timestamps = []
        
        for t in telemetry_list:
            raw_logs.extend(t.error_logs)
            raw_alerts.extend(t.alerts)
            timestamps.append(t.timestamp)

        # Base initialization without anomaly or severity processing
        incident = IncidentData(
            incident_id=f"inc-{uuid.uuid4().hex[:8]}",
            website=primary.website,
            service_name=primary.service_name,
            endpoint=primary.endpoint,
            response_time=primary.response_time,
            status_code=primary.status_code,
            uptime_status=primary.uptime_status,
            ssl_status=primary.ssl_status,
            suspicious_logs=raw_logs,
            alerts=raw_alerts,
            severity="unknown",
            anomaly_score=0.0,
            timestamps=timestamps,
            telemetry_source="multi-source",
            raw_telemetry=telemetry_list
        )
        
        return incident
