from schemas.incident_schema import IncidentData

class AnomalyDetector:
    def detect(self, incident: IncidentData) -> IncidentData:
        """
        Analyzes the normalized incident to calculate an anomaly score and detect specific patterns.
        """
        score = 0.0
        reasoning = []

        # 1. Latency Analysis
        if incident.response_time > 1000:
            score += 0.4
            incident.latency_spike = True
            reasoning.append(f"Severe latency spike detected: {incident.response_time:.0f}ms")
        elif incident.response_time > 500:
            score += 0.2
            incident.latency_spike = True
            reasoning.append(f"Elevated latency detected: {incident.response_time:.0f}ms")

        # 2. HTTP Status and Uptime Analysis
        if incident.uptime_status == "down":
            score += 0.6
            reasoning.append("Service is currently reported as DOWN.")
        elif incident.status_code and incident.status_code >= 500:
            score += 0.5
            reasoning.append(f"Server error response code: {incident.status_code}")

        # 3. Log Pattern Analysis
        if incident.suspicious_logs:
            score += 0.3
            reasoning.append(f"Found {len(incident.suspicious_logs)} suspicious log entries.")
            # Simple mock error rate extraction
            incident.error_rate = min(len(incident.suspicious_logs) * 5.0, 100.0)

        # 4. Alert Analysis
        if incident.alerts:
            score += 0.3
            reasoning.append(f"Active alerts present ({len(incident.alerts)}).")

        incident.anomaly_score = min(score, 1.0)
        incident.anomaly_reasoning = reasoning
        
        return incident
