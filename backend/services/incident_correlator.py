from typing import List
from schemas.incident_schema import IncidentData
from services.telemetry_aggregator import TelemetryAggregator
from services.telemetry_normalizer import TelemetryNormalizer
from services.anomaly_detector import AnomalyDetector
from services.severity_classifier import SeverityClassifier

class IncidentCorrelator:
    def __init__(self):
        self.aggregator = TelemetryAggregator()
        self.normalizer = TelemetryNormalizer()
        self.anomaly_detector = AnomalyDetector()
        self.severity_classifier = SeverityClassifier()

    async def generate_incident(self, url: str) -> IncidentData:
        """
        Orchestrates the entire pipeline: 
        Fetch Telemetry -> Normalize -> Detect Anomalies -> Classify Severity -> Correlate.
        """
        # 1. Fetch raw telemetry from all configured sources
        raw_telemetry_list = await self.aggregator.aggregate_all(url)
        
        if not raw_telemetry_list:
            raise ValueError("No telemetry data available for correlation.")

        # 2. Normalize telemetry into a base IncidentData object
        incident = self.normalizer.normalize(raw_telemetry_list)

        # 3. Detect Anomalies
        incident = self.anomaly_detector.detect(incident)

        # 4. Classify Severity
        incident = self.severity_classifier.classify(incident)

        # 5. Incident Correlation (Mocking correlation logic for this step)
        # In a real scenario, we'd query past incidents, trace ID mappings, and deployment logs.
        incident.impacted_services = [incident.service_name, "API Gateway", "Auth Service"]
        
        # Mocking a deployment event correlation if the score is high
        if incident.anomaly_score > 0.4:
            incident.deployment_events.append({
                "id": "dep-9982",
                "service": incident.service_name,
                "version": "v1.4.3",
                "time_relative": "2 hours ago"
            })
            incident.anomaly_reasoning.append("Recent deployment 'v1.4.3' correlates with the start of the latency spikes.")

        return incident
