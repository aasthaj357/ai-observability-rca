from fastapi import APIRouter, Query, HTTPException
from schemas.incident_schema import IncidentData
from services.incident_correlator import IncidentCorrelator
from services.simulation_state import state

router = APIRouter()
correlator = IncidentCorrelator()

@router.get("/active", response_model=IncidentData)
async def get_active_incident(url: str = Query(..., description="The target URL to correlate telemetry for")):
    """
    Triggers the correlation pipeline and returns a structured IncidentData object.
    If there is a simulated active incident, returns it. Otherwise returns a generated one.
    """
    try:
        if state.active_incident:
            # Convert dictionary to IncidentData schema if needed, but fastapi can just return the dict
            return state.active_incident
        return await correlator.generate_incident(url)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/recent")
async def get_recent_incidents():
    """
    Returns a list of recent simulated incidents for the dashboard IncidentCards.
    """
    incidents = []
    if state.active_incident:
        incidents.append(state.active_incident)
    incidents.extend(state.incident_history)
    return {"incidents": incidents}
