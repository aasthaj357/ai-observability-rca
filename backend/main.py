from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import health, monitoring

app = FastAPI(
    title="AI Observability Platform API",
    description="Backend services for the AI Observability and Reliability Platform",
    version="0.1.0",
)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/api/v1/health", tags=["health"])
app.include_router(monitoring.router, prefix="/api/v1/monitoring", tags=["monitoring"])

from routers import correlation_router, ai_router, websocket_router, report_router
from routers.websocket_router import telemetry_generator
from services.simulation_state import simulation_loop
import asyncio

app.include_router(correlation_router.router, prefix="/api/v1/incidents", tags=["incidents"])
app.include_router(ai_router.router, prefix="/api/v1/ai", tags=["ai"])
app.include_router(websocket_router.router, prefix="/api/v1/ws", tags=["websocket"])
app.include_router(report_router.router, prefix="/api/v1/reports", tags=["reports"])

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(telemetry_generator())
    asyncio.create_task(simulation_loop())

@app.get("/")
async def root():
    return {"message": "Welcome to the AI Observability Platform API"}
