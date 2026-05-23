from schemas.incident_schema import IncidentData

class PromptTemplates:
    @staticmethod
    def get_rca_prompt(incident: IncidentData) -> str:
        return f"""
You are an expert DevOps AI and Site Reliability Engineer.
Analyze the following incident telemetry and generate a structured root cause analysis.

Incident Details:
- Website/Service: {incident.website}
- Response Time: {incident.response_time}ms (Spike: {incident.latency_spike})
- Uptime Status: {incident.uptime_status}
- HTTP Status Code: {incident.status_code}
- SSL Status: {incident.ssl_status}
- Anomaly Score: {incident.anomaly_score}

Anomaly Reasoning:
{chr(10).join(incident.anomaly_reasoning) if incident.anomaly_reasoning else "None"}

Suspicious Logs:
{chr(10).join(incident.suspicious_logs) if incident.suspicious_logs else "None"}

Recent Deployments:
{chr(10).join([f"{d['service']} v{d['version']} ({d['time_relative']})" for d in incident.deployment_events]) if incident.deployment_events else "None"}

Impacted Services:
{', '.join(incident.impacted_services)}

Based on this data, provide a structured JSON response with exactly these keys:
- "root_cause": (string) The most likely root cause.
- "severity": (string) Operational severity (low, medium, high, critical).
- "impacted_services": (list of strings) The services affected.
- "confidence_score": (float) 0.0 to 1.0.
- "explanation": (string) A plain-English explanation of what happened and why (e.g., "The outage likely began after deployment v2.1.4 overloaded the authentication service...").
- "evidence": (list of strings) Key data points that support this conclusion.
- "recommended_priority": (string) P1, P2, P3, P4.
- "suggested_fixes": (list of objects) Each object must have "action" (string), "description" (string), "priority" (string: "immediate", "short-term", "long-term"), "estimated_impact" (string).

Ensure the output is strictly valid JSON without markdown wrapping.
"""

    @staticmethod
    def get_copilot_prompt(message: str, context: dict) -> str:
        return f"""
You are an expert AI SRE Copilot. Answer the user's question concisely based on the following active incident context.

Incident Context:
{context}

User Question:
{message}

Provide a structured JSON response with:
- "answer": (string) A concise, plain-English explanation.
- "suggested_actions": (list of strings) 2-3 short recommended next steps for the user.

Ensure the output is strictly valid JSON without markdown wrapping.
"""
