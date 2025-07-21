"""
Kafka client for inter-service communication
Handles communication between Cepheus agents and Haus platform
"""

import asyncio
import json
from typing import Dict, Any, Callable, Optional
from datetime import datetime
import structlog
from kafka import KafkaProducer, KafkaConsumer
from kafka.errors import KafkaError
import uuid

from app.core.config import get_settings

logger = structlog.get_logger(__name__)

class KafkaClient:
    """Kafka client for agent communication and Haus integration"""
    
    def __init__(self):
        self.settings = get_settings()
        self.producer: Optional[KafkaProducer] = None
        self.consumers: Dict[str, KafkaConsumer] = {}
        self.message_handlers: Dict[str, Callable] = {}
        self.is_connected = False
        
    async def initialize(self):
        """Initialize Kafka connections"""
        try:
            # Initialize producer
            self.producer = KafkaProducer(
                bootstrap_servers=self.settings.KAFKA_BOOTSTRAP_SERVERS,
                value_serializer=lambda v: json.dumps(v).encode('utf-8'),
                key_serializer=lambda k: k.encode('utf-8') if k else None,
                retries=3,
                acks='all',
                compression_type='gzip'
            )
            
            self.is_connected = True
            logger.info("✅ Kafka producer initialized")
            
        except Exception as e:
            logger.error("❌ Kafka initialization failed", error=str(e))
            raise
    
    async def shutdown(self):
        """Shutdown Kafka connections"""
        if self.producer:
            self.producer.close()
            
        for consumer in self.consumers.values():
            consumer.close()
            
        self.is_connected = False
        logger.info("✅ Kafka connections closed")
    
    async def publish_agent_event(self, agent_id: str, event_type: str, data: Dict[str, Any]):
        """Publish agent event to Kafka"""
        if not self.is_connected:
            raise RuntimeError("Kafka client not connected")
        
        topic = f"{self.settings.KAFKA_TOPIC_PREFIX}.agent.{agent_id}"
        
        message = {
            "event_id": str(uuid.uuid4()),
            "agent_id": agent_id,
            "event_type": event_type,
            "data": data,
            "timestamp": datetime.utcnow().isoformat(),
            "source": "cepheus-constellation"
        }
        
        try:
            future = self.producer.send(topic, value=message, key=agent_id)
            record_metadata = future.get(timeout=10)
            
            logger.info("📤 Agent event published",
                       topic=topic,
                       agent_id=agent_id,
                       event_type=event_type,
                       partition=record_metadata.partition,
                       offset=record_metadata.offset)
            
        except KafkaError as e:
            logger.error("❌ Failed to publish agent event",
                        agent_id=agent_id,
                        event_type=event_type,
                        error=str(e))
            raise
    
    async def publish_haus_integration_event(self, event_type: str, data: Dict[str, Any]):
        """Publish event for Haus platform integration"""
        if not self.is_connected:
            raise RuntimeError("Kafka client not connected")
        
        topic = f"{self.settings.KAFKA_TOPIC_PREFIX}.haus.integration"
        
        message = {
            "event_id": str(uuid.uuid4()),
            "event_type": event_type,
            "data": data,
            "timestamp": datetime.utcnow().isoformat(),
            "source": "cepheus-constellation"
        }
        
        try:
            future = self.producer.send(topic, value=message)
            record_metadata = future.get(timeout=10)
            
            logger.info("🏠 Haus integration event published",
                       topic=topic,
                       event_type=event_type,
                       partition=record_metadata.partition,
                       offset=record_metadata.offset)
            
        except KafkaError as e:
            logger.error("❌ Failed to publish Haus integration event",
                        event_type=event_type,
                        error=str(e))
            raise
    
    async def subscribe_to_agent_events(self, agent_id: str, handler: Callable):
        """Subscribe to events from a specific agent"""
        topic = f"{self.settings.KAFKA_TOPIC_PREFIX}.agent.{agent_id}"
        
        try:
            consumer = KafkaConsumer(
                topic,
                bootstrap_servers=self.settings.KAFKA_BOOTSTRAP_SERVERS,
                auto_offset_reset='latest',
                enable_auto_commit=True,
                group_id=f"constellation-{agent_id}",
                value_deserializer=lambda m: json.loads(m.decode('utf-8'))
            )
            
            self.consumers[agent_id] = consumer
            self.message_handlers[agent_id] = handler
            
            # Start consuming in background
            asyncio.create_task(self._consume_messages(agent_id))
            
            logger.info("📥 Subscribed to agent events", agent_id=agent_id, topic=topic)
            
        except Exception as e:
            logger.error("❌ Failed to subscribe to agent events",
                        agent_id=agent_id,
                        error=str(e))
            raise
    
    async def subscribe_to_haus_events(self, handler: Callable):
        """Subscribe to events from Haus platform"""
        topic = f"{self.settings.KAFKA_TOPIC_PREFIX}.haus.events"
        
        try:
            consumer = KafkaConsumer(
                topic,
                bootstrap_servers=self.settings.KAFKA_BOOTSTRAP_SERVERS,
                auto_offset_reset='latest',
                enable_auto_commit=True,
                group_id="constellation-haus-integration",
                value_deserializer=lambda m: json.loads(m.decode('utf-8'))
            )
            
            self.consumers["haus"] = consumer
            self.message_handlers["haus"] = handler
            
            # Start consuming in background
            asyncio.create_task(self._consume_messages("haus"))
            
            logger.info("🏠 Subscribed to Haus platform events", topic=topic)
            
        except Exception as e:
            logger.error("❌ Failed to subscribe to Haus events", error=str(e))
            raise
    
    async def _consume_messages(self, consumer_key: str):
        """Background task to consume messages"""
        consumer = self.consumers[consumer_key]
        handler = self.message_handlers[consumer_key]
        
        logger.info("🔄 Starting message consumption", consumer_key=consumer_key)
        
        try:
            for message in consumer:
                try:
                    await handler(message.value)
                except Exception as e:
                    logger.error("❌ Message handler failed",
                               consumer_key=consumer_key,
                               error=str(e),
                               message=message.value)
                    
        except Exception as e:
            logger.error("❌ Message consumption failed",
                        consumer_key=consumer_key,
                        error=str(e))

# Global Kafka client instance
kafka_client: Optional[KafkaClient] = None

def get_kafka_client() -> KafkaClient:
    """Get global Kafka client instance"""
    global kafka_client
    if kafka_client is None:
        kafka_client = KafkaClient()
    return kafka_client

async def initialize_kafka():
    """Initialize global Kafka client"""
    client = get_kafka_client()
    await client.initialize()
    return client

async def shutdown_kafka():
    """Shutdown global Kafka client"""
    if kafka_client:
        await kafka_client.shutdown()