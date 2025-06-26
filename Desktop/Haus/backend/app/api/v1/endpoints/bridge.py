"""
Bridge API endpoints for Haus platform integration
Handles requests from tRPC services and routes them to constellation agents
"""

from fastapi import APIRouter, HTTPException, Request
from typing import Dict, Any
import structlog
from datetime import datetime

from app.services.haus_bridge import get_haus_bridge
from app.agents.constellation import ConstellationManager

logger = structlog.get_logger(__name__)
router = APIRouter()

@router.post("/haus")
async def handle_haus_request(request: Request, haus_request: Dict[str, Any]):
    """
    Main bridge endpoint for Haus platform requests
    Routes requests to appropriate constellation agents
    """
    try:
        request_type = haus_request.get("type")
        request_data = haus_request.get("data", {})
        priority = haus_request.get("priority", 5)
        requires_mpc = haus_request.get("requires_mpc", False)
        
        logger.info("🌉 Haus bridge request received", 
                   type=request_type, 
                   priority=priority,
                   requires_mpc=requires_mpc)
        
        # Get constellation manager from app state
        constellation = request.app.state.constellation
        if not constellation:
            raise HTTPException(status_code=500, detail="Constellation not available")
        
        # Route request based on type
        if request_type == "equity_analysis_enhanced":
            result = await _handle_equity_analysis(constellation, request_data, requires_mpc)
        elif request_type == "property_valuation_mpc":
            result = await _handle_property_valuation(constellation, request_data, requires_mpc)
        elif request_type == "housing_application_workflow":
            result = await _handle_housing_application(constellation, request_data)
        else:
            raise HTTPException(status_code=400, detail=f"Unknown request type: {request_type}")
        
        return {
            "success": True,
            "result": result,
            "processed_by": "cepheus-constellation",
            "constellation_id": result.get("workflow_id"),
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error("❌ Haus bridge request failed", 
                    request_type=haus_request.get("type"), 
                    error=str(e))
        
        return {
            "success": False,
            "error": str(e),
            "processed_by": "cepheus-constellation",
            "timestamp": datetime.utcnow().isoformat()
        }

async def _handle_equity_analysis(constellation: ConstellationManager, 
                                request_data: Dict[str, Any], 
                                requires_mpc: bool) -> Dict[str, Any]:
    """Handle equity analysis requests with optional MPC enhancement"""
    
    # Get the Alderamin orchestrator to coordinate the workflow
    alderamin = await constellation.get_agent("alderamin")
    if not alderamin:
        raise RuntimeError("Alderamin orchestrator not available")
    
    # Create equity analysis workflow
    workflow_request = {
        "type": "equity_analysis_enhanced",
        "property_data": request_data.get("property_data", {}),
        "user_preferences": request_data.get("user_preferences", {}),
        "requires_mpc": requires_mpc,
        "privacy_requirements": request_data.get("privacy_requirements", {}),
        "traditional_result": request_data.get("traditional_result", {})
    }
    
    # Delegate to constellation
    from app.agents.base import AgentTask
    task = AgentTask(
        task_id=f"equity-{datetime.utcnow().isoformat()}",
        task_type="equity_analysis_enhanced",
        payload=workflow_request,
        created_at=datetime.utcnow()
    )
    
    # Submit task and wait for result (simplified for Week 1)
    await alderamin.submit_task(task)
    
    return {
        "workflow_id": task.task_id,
        "status": "submitted",
        "message": "Equity analysis submitted to constellation",
        "mpc_enabled": requires_mpc
    }

async def _handle_property_valuation(constellation: ConstellationManager, 
                                   request_data: Dict[str, Any], 
                                   requires_mpc: bool) -> Dict[str, Any]:
    """Handle property valuation requests with MPC privacy protection"""
    
    alderamin = await constellation.get_agent("alderamin")
    if not alderamin:
        raise RuntimeError("Alderamin orchestrator not available")
    
    # Create property valuation workflow
    workflow_request = {
        "type": "property_valuation_mpc",
        "property_data": request_data,
        "requires_mpc": requires_mpc,
        "privacy_guarantees": {
            "hide_individual_appraisals": True,
            "aggregate_only": True,
            "minimum_participants": 3
        }
    }
    
    from app.agents.base import AgentTask
    task = AgentTask(
        task_id=f"valuation-{datetime.utcnow().isoformat()}",
        task_type="property_valuation_mpc",
        payload=workflow_request,
        created_at=datetime.utcnow()
    )
    
    await alderamin.submit_task(task)
    
    return {
        "workflow_id": task.task_id,
        "status": "submitted",
        "message": "Property valuation submitted to constellation",
        "mpc_privacy_enabled": requires_mpc
    }

async def _handle_housing_application(constellation: ConstellationManager, 
                                    request_data: Dict[str, Any]) -> Dict[str, Any]:
    """Handle housing application workflow coordination"""
    
    alderamin = await constellation.get_agent("alderamin")
    if not alderamin:
        raise RuntimeError("Alderamin orchestrator not available")
    
    # Create housing application workflow
    workflow_request = {
        "type": "housing_application_workflow",
        "applicant_data": request_data.get("applicant_data", {}),
        "property_data": request_data.get("property_data", {}),
        "application_requirements": request_data.get("requirements", {}),
        "workflow_steps": [
            "identity_verification",
            "compliance_checking", 
            "payment_setup",
            "government_integration"
        ]
    }
    
    from app.agents.base import AgentTask
    task = AgentTask(
        task_id=f"housing-app-{datetime.utcnow().isoformat()}",
        task_type="housing_application_workflow",
        payload=workflow_request,
        created_at=datetime.utcnow()
    )
    
    await alderamin.submit_task(task)
    
    return {
        "workflow_id": task.task_id,
        "status": "submitted",
        "message": "Housing application submitted to constellation",
        "workflow_steps": workflow_request["workflow_steps"]
    }

@router.get("/status")
async def get_bridge_status(request: Request):
    """Get bridge connectivity and health status"""
    try:
        haus_bridge = get_haus_bridge()
        bridge_health = await haus_bridge.health_check()
        
        constellation = request.app.state.constellation
        constellation_health = await constellation.health_check() if constellation else {}
        
        return {
            "bridge_status": "healthy",
            "haus_integration": bridge_health,
            "constellation_status": constellation_health,
            "last_check": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error("❌ Bridge status check failed", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))