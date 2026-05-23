from fastapi import APIRouter
from schemas.health import HealthResponse

router = APIRouter()

@router.get("/", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint to ensure the API is running.
    """
    return HealthResponse(status="healthy", version="0.1.0")
