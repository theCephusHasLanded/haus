"""
Bridge service for integrating Cepheus Constellation with existing Haus platform
Provides seamless communication between FastAPI agents and tRPC services
"""

import asyncio
import httpx
from typing import Dict, Any, Optional, List
import structlog
from datetime import datetime

from app.core.config import get_settings
from app.core.kafka_client import get_kafka_client

logger = structlog.get_logger(__name__)

class HausBridge:
    """
    Bridge between Cepheus Constellation and existing Haus platform
    
    Responsibilities:
    - Route requests between FastAPI and tRPC systems
    - Transform data formats between systems
    - Maintain consistency across platforms
    - Coordinate agent operations with existing services
    """
    
    def __init__(self):
        self.settings = get_settings()
        self.http_client: Optional[httpx.AsyncClient] = None
        self.kafka_client = get_kafka_client()
        
    async def initialize(self):
        """Initialize bridge connections"""
        try:
            self.http_client = httpx.AsyncClient(
                base_url=self.settings.HAUS_API_URL,
                timeout=30.0,
                headers={
                    "Content-Type": "application/json",
                    "X-Source": "cepheus-constellation"
                }
            )
            
            # Test connection to Haus API
            response = await self.http_client.get("/health")
            if response.status_code == 200:
                logger.info("✅ Bridge connected to Haus API")
            else:
                raise RuntimeError(f"Haus API health check failed: {response.status_code}")
                
        except Exception as e:
            logger.error("❌ Bridge initialization failed", error=str(e))
            raise
    
    async def shutdown(self):
        """Shutdown bridge connections"""
        if self.http_client:
            await self.http_client.aclose()
            
        logger.info("✅ Haus bridge shutdown complete")
    
    # Property-related bridge methods
    
    async def get_property_data(self, property_id: str) -> Dict[str, Any]:
        """Get property data from Haus platform"""
        try:
            response = await self.http_client.post(
                "/trpc/properties.getById",
                json={"input": {"json": {"id": property_id}}}
            )
            
            if response.status_code == 200:
                data = response.json()
                logger.info("📊 Property data retrieved", property_id=property_id)
                return data.get("result", {}).get("data", {}).get("json", {})
            else:
                raise RuntimeError(f"Failed to get property data: {response.status_code}")
                
        except Exception as e:
            logger.error("❌ Failed to get property data", 
                        property_id=property_id, 
                        error=str(e))
            raise
    
    async def search_properties(self, search_criteria: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Search properties using Haus platform"""
        try:
            response = await self.http_client.post(
                "/trpc/properties.search",
                json={"input": {"json": search_criteria}}
            )
            
            if response.status_code == 200:
                data = response.json()
                properties = data.get("result", {}).get("data", {}).get("json", [])
                logger.info("🔍 Properties searched", 
                           criteria=search_criteria, 
                           results_count=len(properties))
                return properties
            else:
                raise RuntimeError(f"Property search failed: {response.status_code}")
                
        except Exception as e:
            logger.error("❌ Property search failed", 
                        criteria=search_criteria, 
                        error=str(e))
            raise
    
    # Equity analysis bridge methods
    
    async def get_equity_analysis(self, analysis_request: Dict[str, Any]) -> Dict[str, Any]:
        """Get equity analysis from existing Haus EquityService"""
        try:
            response = await self.http_client.post(
                "/trpc/equity.getEquityMetrics",
                json={"input": {"json": analysis_request}}
            )
            
            if response.status_code == 200:
                data = response.json()
                logger.info("📈 Equity analysis retrieved", request=analysis_request)
                return data.get("result", {}).get("data", {}).get("json", {})
            else:
                raise RuntimeError(f"Equity analysis failed: {response.status_code}")
                
        except Exception as e:
            logger.error("❌ Equity analysis failed", 
                        request=analysis_request, 
                        error=str(e))
            raise
    
    async def compare_area_equity(self, area_comparison: Dict[str, Any]) -> Dict[str, Any]:
        """Compare equity metrics across areas using Haus platform"""
        try:
            response = await self.http_client.post(
                "/trpc/equity.compareAreas",
                json={"input": {"json": area_comparison}}
            )
            
            if response.status_code == 200:
                data = response.json()
                logger.info("📊 Area equity comparison completed", comparison=area_comparison)
                return data.get("result", {}).get("data", {}).get("json", {})
            else:
                raise RuntimeError(f"Area comparison failed: {response.status_code}")
                
        except Exception as e:
            logger.error("❌ Area equity comparison failed", 
                        comparison=area_comparison, 
                        error=str(e))
            raise
    
    # User management bridge methods
    
    async def authenticate_user(self, credentials: Dict[str, Any]) -> Dict[str, Any]:
        """Authenticate user through Haus platform"""
        try:
            response = await self.http_client.post(
                "/trpc/users.login",
                json={"input": {"json": credentials}}
            )
            
            if response.status_code == 200:
                data = response.json()
                logger.info("🔐 User authenticated", user_id=credentials.get("email", "unknown"))
                return data.get("result", {}).get("data", {}).get("json", {})
            else:
                raise RuntimeError(f"Authentication failed: {response.status_code}")
                
        except Exception as e:
            logger.error("❌ User authentication failed", 
                        credentials=credentials, 
                        error=str(e))
            raise
    
    # Constellation integration methods
    
    async def notify_haus_of_agent_event(self, agent_id: str, event_type: str, event_data: Dict[str, Any]):
        """Notify Haus platform of constellation agent events"""
        try:
            # Send notification via Kafka for real-time updates
            await self.kafka_client.publish_haus_integration_event(
                event_type=f"agent.{event_type}",
                data={
                    "agent_id": agent_id,
                    "event_data": event_data,
                    "timestamp": datetime.utcnow().isoformat()
                }
            )
            
            logger.info("📡 Agent event sent to Haus platform", 
                       agent_id=agent_id, 
                       event_type=event_type)
            
        except Exception as e:
            logger.error("❌ Failed to notify Haus of agent event", 
                        agent_id=agent_id, 
                        event_type=event_type, 
                        error=str(e))
            raise
    
    async def request_enhanced_equity_analysis(self, 
                                             property_data: Dict[str, Any], 
                                             mpc_results: Dict[str, Any]) -> Dict[str, Any]:
        """
        Request enhanced equity analysis combining traditional Haus calculations
        with MPC privacy-preserving results
        """
        try:
            enhanced_request = {
                "property_data": property_data,
                "mpc_enhanced": True,
                "mpc_results": mpc_results,
                "privacy_guarantees": mpc_results.get("privacy_guarantees", {}),
                "constellation_computed": True
            }
            
            # Use existing equity analysis but with enhanced data
            traditional_analysis = await self.get_equity_analysis(property_data)
            
            # Combine with MPC results
            enhanced_analysis = {
                **traditional_analysis,
                "mpc_enhanced": True,
                "privacy_preserving_metrics": mpc_results.get("computation_result", {}),
                "confidence_score": mpc_results.get("confidence_score", 0),
                "constellation_verified": True,
                "enhanced_timestamp": datetime.utcnow().isoformat()
            }
            
            logger.info("🔐 Enhanced equity analysis completed", 
                       property_id=property_data.get("id"))
            
            return enhanced_analysis
            
        except Exception as e:
            logger.error("❌ Enhanced equity analysis failed", 
                        property_data=property_data, 
                        error=str(e))
            raise
    
    # Data transformation methods
    
    def transform_agent_data_for_haus(self, agent_data: Dict[str, Any]) -> Dict[str, Any]:
        """Transform agent data format to match Haus platform expectations"""
        return {
            "source": "cepheus-constellation",
            "agent_processed": True,
            "constellation_data": agent_data,
            "transformed_at": datetime.utcnow().isoformat()
        }
    
    def transform_haus_data_for_agents(self, haus_data: Dict[str, Any]) -> Dict[str, Any]:
        """Transform Haus platform data for agent consumption"""
        return {
            "haus_source": True,
            "data": haus_data,
            "agent_compatible": True,
            "transformed_at": datetime.utcnow().isoformat()
        }
    
    # Health and monitoring methods
    
    async def health_check(self) -> Dict[str, Any]:
        """Check health of bridge connections"""
        try:
            # Check Haus API connectivity
            haus_response = await self.http_client.get("/health")
            haus_healthy = haus_response.status_code == 200
            
            # Check Kafka connectivity
            kafka_healthy = self.kafka_client.is_connected if self.kafka_client else False
            
            return {
                "bridge_status": "healthy" if haus_healthy and kafka_healthy else "degraded",
                "haus_api_connection": "healthy" if haus_healthy else "failed",
                "kafka_connection": "healthy" if kafka_healthy else "failed",
                "last_check": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error("❌ Bridge health check failed", error=str(e))
            return {
                "bridge_status": "failed",
                "error": str(e),
                "last_check": datetime.utcnow().isoformat()
            }

# Global bridge instance
_haus_bridge: Optional[HausBridge] = None

def get_haus_bridge() -> HausBridge:
    """Get global Haus bridge instance"""
    global _haus_bridge
    if _haus_bridge is None:
        _haus_bridge = HausBridge()
    return _haus_bridge

async def initialize_haus_bridge() -> HausBridge:
    """Initialize global Haus bridge"""
    bridge = get_haus_bridge()
    await bridge.initialize()
    return bridge

async def shutdown_haus_bridge():
    """Shutdown global Haus bridge"""
    if _haus_bridge:
        await _haus_bridge.shutdown()