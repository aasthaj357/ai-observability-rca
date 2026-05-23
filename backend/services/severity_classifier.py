from schemas.incident_schema import IncidentData

class SeverityClassifier:
    def classify(self, incident: IncidentData) -> IncidentData:
        """
        Assigns a severity level to the incident based on its anomaly score and characteristics.
        """
        if incident.uptime_status == "down":
            incident.severity = "CRITICAL"
        elif incident.anomaly_score >= 0.8:
            incident.severity = "HIGH"
        elif incident.anomaly_score >= 0.5:
            incident.severity = "MEDIUM"
        elif incident.anomaly_score > 0.0:
            incident.severity = "LOW"
        else:
            incident.severity = "INFO"
            
        return incident
