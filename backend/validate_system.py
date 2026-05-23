import asyncio
import json
from config.settings import settings
from services.incident_correlator import IncidentCorrelator
from services.gemini_service import GeminiService
from schemas.ai_analysis import CopilotRequest

async def validate_system():
    print("Starting STRICT System Validation...")
    results = {}
    
    # 1. Config Validation
    try:
        assert settings.gemini_api_key is not None, "Missing GEMINI_API_KEY"
        results['config'] = "PASS"
    except Exception as e:
        results['config'] = f"FAIL: {str(e)}"
        
    # 2 & 3. Telemetry Ingestion & Correlation Validation
    try:
        correlator = IncidentCorrelator()
        # Generate incident which internally runs the telemetry aggregator, normalization, and detection
        incident = await correlator.generate_incident("https://api.example.com")
        assert incident is not None, "Failed to correlate incident"
        assert incident.severity in ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"], f"Severity was {incident.severity}"
        results['telemetry_and_correlation'] = "PASS"
    except Exception as e:
        results['telemetry_and_correlation'] = f"FAIL: {str(e)}"
        
    # 4. Gemini RCA & Copilot Validation
    try:
        gemini = GeminiService()
        if 'incident' in locals() and incident:
            # Test RCA
            rca = await gemini.analyze_incident(incident)
            assert rca is not None
            results['gemini_rca'] = "PASS"
            
            # Test Copilot
            copilot_req = CopilotRequest(
                message="Why is the website slow?", 
                context={"incident_id": incident.incident_id, "severity": incident.severity}
            )
            copilot_res = await gemini.ask_copilot(copilot_req)
            assert copilot_res is not None
            assert copilot_res.answer, "Copilot answer is empty"
            results['copilot'] = "PASS"
        else:
            results['gemini_rca'] = "FAIL: Incident generation failed previously"
            results['copilot'] = "FAIL: Incident generation failed previously"
    except Exception as e:
        results['gemini_rca'] = f"FAIL: {str(e)}"
        results['copilot'] = f"FAIL: {str(e)}"
        
    print(json.dumps(results, indent=2))
    
    if any("FAIL" in v for v in results.values()):
        exit(1)
    else:
        print("\nALL CRITICAL SYSTEMS PASS VALIDATION!")
        exit(0)

if __name__ == "__main__":
    asyncio.run(validate_system())
