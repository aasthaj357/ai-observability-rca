from fastapi import APIRouter, Query, HTTPException
from typing import List
from schemas.telemetry import TelemetryData
from services.telemetry_aggregator import TelemetryAggregator
from services.simulation_state import state
import random
from datetime import datetime, timedelta

router = APIRouter()
aggregator = TelemetryAggregator()

@router.get("/status")
async def get_system_status():
    return {"status": "operational" if not state.active_incident else "degraded", "active_incidents": 1 if state.active_incident else 0}

@router.get("/metrics")
async def get_metrics():
    """
    Returns time-series metrics for the charts from the simulation state.
    """
    return {"data": list(state.metrics_history)}

@router.get("/logs")
async def get_logs():
    """
    Returns recent system logs from the simulation state.
    """
    # Return a copy to avoid mutation issues
    return {"logs": list(state.logs_history)}

@router.get("/deployments")
async def get_deployments():
    """
    Returns recent deployment events.
    """
    return {"deployments": state.deployments}

@router.get("/check", response_model=TelemetryData)
async def check_website(url: str = Query(..., description="The URL of the website to monitor")):
    """
    Run an active health check on a specific website.
    """
    try:
        return await aggregator.run_website_check(url)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/aggregate", response_model=List[TelemetryData])
async def aggregate_telemetry(url: str = Query(None, description="Optional target URL to include in the aggregation")):
    """
    Fetch and aggregate telemetry from all configured sources (Grafana, New Relic, active monitoring).
    """
    try:
        return await aggregator.aggregate_all(url)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
