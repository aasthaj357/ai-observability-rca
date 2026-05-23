import json
import csv
import io
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from services.simulation_state import state
from services.gemini_service import GeminiService
from schemas.incident_schema import IncidentData

class ReportService:
    def __init__(self):
        self.gemini = GeminiService()

    async def get_report_data(self):
        """Aggregate data for the report from the current state."""
        incident = state.active_incident
        if not incident and state.incident_history:
            incident = state.incident_history[0]
            
        metrics = state.metrics_history
        logs = state.logs_history
        deployments = state.deployments
        
        rca_result = None
        if incident:
            # We construct a mock IncidentData to pass to gemini if we only have dictionary from state
            if isinstance(incident, dict):
                inc_data = IncidentData(
                    incident_id=incident.get("id", "UNKNOWN"),
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
            else:
                inc_data = incident
                
            rca_result = await self.gemini.analyze_incident(inc_data)

        return {
            "incident": incident,
            "metrics": metrics,
            "logs": logs,
            "deployments": deployments,
            "rca": rca_result.dict() if rca_result else None
        }

    async def generate_json(self):
        data = await self.get_report_data()
        return json.dumps(data, indent=2)

    async def generate_csv(self):
        data = await self.get_report_data()
        output = io.StringIO()
        writer = csv.writer(output)
        
        writer.writerow(["Timestamp", "Requests", "Errors"])
        for m in data["metrics"]:
            writer.writerow([m.get("time"), m.get("requests"), m.get("errors")])
            
        writer.writerow([])
        writer.writerow(["Log Timestamp", "Level", "Message"])
        for l in data["logs"]:
            writer.writerow([l.get("timestamp"), l.get("level"), l.get("message")])
            
        return output.getvalue()

    async def generate_pdf(self):
        data = await self.get_report_data()
        
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        styles = getSampleStyleSheet()
        elements = []
        
        # Title
        elements.append(Paragraph("AI Observability Incident Report", styles['Title']))
        elements.append(Spacer(1, 12))
        
        incident = data["incident"]
        if incident:
            inc_id = incident.get('id', 'N/A') if isinstance(incident, dict) else getattr(incident, 'incident_id', 'N/A')
            elements.append(Paragraph(f"<b>Incident ID:</b> {inc_id}", styles['Normal']))
            elements.append(Paragraph(f"<b>Generated At:</b> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", styles['Normal']))
            elements.append(Spacer(1, 12))
            
            # RCA
            rca = data.get("rca")
            if rca:
                elements.append(Paragraph("<b>AI Root Cause Analysis</b>", styles['Heading2']))
                elements.append(Paragraph(f"<b>Root Cause:</b> {rca.get('root_cause', '')}", styles['Normal']))
                elements.append(Paragraph(f"<b>Confidence:</b> {rca.get('confidence_score', 0)}", styles['Normal']))
                elements.append(Paragraph(f"<b>Explanation:</b> {rca.get('explanation', '')}", styles['Normal']))
                
                fixes = rca.get('suggested_fixes', [])
                if fixes:
                    elements.append(Paragraph("<b>Suggested Fixes:</b>", styles['Heading3']))
                    for f in fixes:
                        elements.append(Paragraph(f"• {f.get('action')}: {f.get('description')}", styles['Normal']))
                        
        elements.append(Spacer(1, 12))
        elements.append(Paragraph("<b>Recent Telemetry (Metrics)</b>", styles['Heading2']))
        
        # Telemetry Table
        table_data = [["Time", "Requests", "Errors"]]
        for m in data["metrics"][-10:]:
            table_data.append([str(m.get("time")), str(m.get("requests")), str(m.get("errors"))])
            
        t = Table(table_data)
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.grey),
            ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0,0), (-1,0), 12),
            ('BACKGROUND', (0,1), (-1,-1), colors.beige),
            ('GRID', (0,0), (-1,-1), 1, colors.black)
        ]))
        elements.append(t)
        
        doc.build(elements)
        return buffer.getvalue()
