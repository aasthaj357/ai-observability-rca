import asyncio
import random
from datetime import datetime
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from services.websocket_manager import manager
from services.simulation_state import state

router = APIRouter()

async def telemetry_generator():
    """Background task to simulate live telemetry broadcasting."""
    services = ["auth-service", "payment-api", "user-db", "frontend-gateway"]
    while True:
        try:
            if manager.active_connections:
                # If incident is active, increase likelihood of bad telemetry
                if state.active_incident:
                    status_codes = [200, 500, 502, 503, 504]
                    base_latency = 500
                    target_service = state.active_incident["service_name"]
                    service = target_service if random.random() < 0.7 else random.choice(services)
                else:
                    status_codes = [200, 200, 200, 200, 201, 404]
                    base_latency = 10
                    service = random.choice(services)

                payload = {
                    "timestamp": datetime.utcnow().isoformat(),
                    "service": service,
                    "latency": base_latency + random.randint(10, 800 if state.active_incident else 100),
                    "status_code": random.choice(status_codes),
                    "type": "telemetry_ping"
                }
                await manager.broadcast(payload)
        except Exception as e:
            print(f"Broadcast error: {e}")
        await asyncio.sleep(2) # Broadcast every 2 seconds

@router.websocket("/telemetry")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # We don't expect messages from client in this uni-directional feed,
            # but we need to await to keep connection open
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
