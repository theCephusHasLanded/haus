"""
Main API router for Cepheus Constellation
Provides endpoints for agent management and Haus platform integration
"""

from fastapi import APIRouter
from app.api.v1.endpoints import agents, workflows, bridge, health

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(agents.router, prefix="/agents", tags=["agents"])
api_router.include_router(workflows.router, prefix="/workflows", tags=["workflows"])
api_router.include_router(bridge.router, prefix="/bridge", tags=["bridge"])