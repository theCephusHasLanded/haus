"""
WebSocket Manager for real-time constellation monitoring
"""

from typing import List, Dict, Any
from fastapi import WebSocket, WebSocketDisconnect
import json
import asyncio
import structlog
from datetime import datetime

logger = structlog.get_logger(__name__)

class WebSocketManager:
    """
    Manages WebSocket connections for real-time constellation monitoring
    """
    
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.connection_info: Dict[WebSocket, Dict[str, Any]] = {}
    
    async def connect(self, websocket: WebSocket):
        """Accept a new WebSocket connection"""
        await websocket.accept()
        self.active_connections.append(websocket)
        self.connection_info[websocket] = {
            "connected_at": datetime.utcnow(),
            "last_message": None
        }
        
        logger.info("🔌 WebSocket client connected", 
                   total_connections=len(self.active_connections))
    
    def disconnect(self, websocket: WebSocket):
        """Disconnect a WebSocket connection"""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            self.connection_info.pop(websocket, None)
            
            logger.info("🔌 WebSocket client disconnected", 
                       total_connections=len(self.active_connections))
    
    async def send_personal_message(self, message: str, websocket: WebSocket):
        """Send a message to a specific WebSocket connection"""
        try:
            await websocket.send_text(message)
            self.connection_info[websocket]["last_message"] = datetime.utcnow()
        except Exception as e:
            logger.error("❌ Failed to send WebSocket message", error=str(e))
            self.disconnect(websocket)
    
    async def broadcast(self, message: str):
        """Broadcast a message to all connected WebSocket clients"""
        if not self.active_connections:
            return
        
        disconnected_clients = []
        
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
                self.connection_info[connection]["last_message"] = datetime.utcnow()
            except Exception as e:
                logger.error("❌ Failed to broadcast to WebSocket client", error=str(e))
                disconnected_clients.append(connection)
        
        # Clean up disconnected clients
        for client in disconnected_clients:
            self.disconnect(client)
    
    async def broadcast_json(self, data: Dict[str, Any]):
        """Broadcast JSON data to all connected clients"""
        message = json.dumps(data)
        await self.broadcast(message)
    
    def get_connection_count(self) -> int:
        """Get the number of active connections"""
        return len(self.active_connections)
    
    def get_connection_info(self) -> Dict[str, Any]:
        """Get information about all connections"""
        return {
            "total_connections": len(self.active_connections),
            "connections": [
                {
                    "connected_at": info["connected_at"].isoformat(),
                    "last_message": info["last_message"].isoformat() if info["last_message"] else None
                }
                for info in self.connection_info.values()
            ]
        }