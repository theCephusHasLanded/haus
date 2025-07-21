"""
Advanced Event Bus for Constellation Coordination
Week 3 Enhancement: High-performance event-driven architecture for agent coordination
"""

import asyncio
import json
import time
from typing import Dict, List, Optional, Any, Callable, Set, Union
from datetime import datetime, timedelta
from dataclasses import dataclass, field
from enum import Enum
from collections import defaultdict, deque
import structlog
import uuid
import weakref
from contextlib import asynccontextmanager

logger = structlog.get_logger(__name__)

class EventType(str, Enum):
    """Types of constellation events"""
    AGENT_REGISTERED = "agent_registered"
    AGENT_UNREGISTERED = "agent_unregistered"
    AGENT_STATUS_CHANGED = "agent_status_changed"
    TASK_STARTED = "task_started"
    TASK_COMPLETED = "task_completed"
    TASK_FAILED = "task_failed"
    WORKFLOW_STARTED = "workflow_started"
    WORKFLOW_COMPLETED = "workflow_completed"
    WORKFLOW_FAILED = "workflow_failed"
    SYSTEM_ALERT = "system_alert"
    RESOURCE_THRESHOLD = "resource_threshold"
    CONSTELLATION_STATUS_CHANGED = "constellation_status_changed"
    HEALTH_CHECK = "health_check"
    METRIC_UPDATE = "metric_update"
    CUSTOM = "custom"

class EventPriority(int, Enum):
    """Event priority levels"""
    CRITICAL = 1
    HIGH = 2
    NORMAL = 3
    LOW = 4
    BACKGROUND = 5

@dataclass
class Event:
    """Event data structure"""
    event_id: str
    event_type: EventType
    source_agent: str
    timestamp: datetime
    priority: EventPriority
    data: Dict[str, Any]
    correlation_id: Optional[str] = None
    ttl_seconds: int = 300
    tags: Set[str] = field(default_factory=set)
    metadata: Dict[str, Any] = field(default_factory=dict)

@dataclass
class EventSubscription:
    """Event subscription configuration"""
    subscriber_id: str
    event_types: Set[EventType]
    callback: Callable[[Event], Any]
    filters: List[Callable[[Event], bool]] = field(default_factory=list)
    priority_threshold: EventPriority = EventPriority.BACKGROUND
    tags: Set[str] = field(default_factory=set)
    is_active: bool = True
    subscription_time: datetime = field(default_factory=datetime.utcnow)

@dataclass
class EventRoute:
    """Event routing configuration"""
    source_pattern: str
    target_agents: List[str]
    event_types: Set[EventType]
    transformation: Optional[Callable[[Event], Event]] = None
    condition: Optional[Callable[[Event], bool]] = None

class EventDeliveryMode(str, Enum):
    """Event delivery guarantees"""
    FIRE_AND_FORGET = "fire_and_forget"
    AT_LEAST_ONCE = "at_least_once"
    AT_MOST_ONCE = "at_most_once"
    EXACTLY_ONCE = "exactly_once"

class EventBuffer:
    """Circular buffer for event storage with automatic cleanup"""
    
    def __init__(self, max_size: int = 10000):
        self.max_size = max_size
        self.events: deque = deque(maxlen=max_size)
        self.index: Dict[str, Event] = {}
        self.type_index: Dict[EventType, List[Event]] = defaultdict(list)
        self._lock = asyncio.Lock()

    async def add_event(self, event: Event):
        """Add event to buffer"""
        async with self._lock:
            # Remove old event if buffer is full
            if len(self.events) >= self.max_size:
                old_event = self.events[0]
                if old_event.event_id in self.index:
                    del self.index[old_event.event_id]
                    self.type_index[old_event.event_type].remove(old_event)
            
            # Add new event
            self.events.append(event)
            self.index[event.event_id] = event
            self.type_index[event.event_type].append(event)

    async def get_events_by_type(self, event_type: EventType, limit: int = 100) -> List[Event]:
        """Get events by type"""
        async with self._lock:
            return list(self.type_index[event_type][-limit:])

    async def get_recent_events(self, limit: int = 100) -> List[Event]:
        """Get most recent events"""
        async with self._lock:
            return list(self.events)[-limit:]

    async def cleanup_expired_events(self):
        """Remove expired events"""
        current_time = datetime.utcnow()
        expired_events = []
        
        async with self._lock:
            for event in list(self.events):
                if current_time > event.timestamp + timedelta(seconds=event.ttl_seconds):
                    expired_events.append(event)
            
            for event in expired_events:
                if event in self.events:
                    self.events.remove(event)
                if event.event_id in self.index:
                    del self.index[event.event_id]
                if event in self.type_index[event.event_type]:
                    self.type_index[event.event_type].remove(event)
        
        if expired_events:
            logger.debug(f"Cleaned up {len(expired_events)} expired events")

class ConstellationEventBus:
    """
    Advanced event bus for constellation-wide coordination
    Supports reliable delivery, event routing, and real-time subscriptions
    """
    
    def __init__(self, bus_id: str = "constellation-main"):
        self.bus_id = bus_id
        self.subscriptions: Dict[str, EventSubscription] = {}
        self.event_routes: List[EventRoute] = []
        self.event_buffer = EventBuffer()
        
        # Delivery tracking
        self.pending_deliveries: Dict[str, Set[str]] = defaultdict(set)  # event_id -> subscriber_ids
        self.delivery_confirmations: Dict[str, Dict[str, datetime]] = defaultdict(dict)
        
        # Performance metrics
        self.metrics = {
            "events_published": 0,
            "events_delivered": 0,
            "failed_deliveries": 0,
            "average_delivery_time": 0.0,
            "active_subscriptions": 0
        }
        
        # Background tasks
        self._cleanup_task: Optional[asyncio.Task] = None
        self._delivery_task: Optional[asyncio.Task] = None
        self._is_running = False
        
        logger.info("Constellation event bus initialized", bus_id=bus_id)

    async def start(self):
        """Start the event bus background tasks"""
        if self._is_running:
            return
        
        self._is_running = True
        
        # Start cleanup task
        self._cleanup_task = asyncio.create_task(self._cleanup_loop())
        
        # Start delivery monitoring task
        self._delivery_task = asyncio.create_task(self._delivery_monitoring_loop())
        
        logger.info("Event bus started", bus_id=self.bus_id)

    async def stop(self):
        """Stop the event bus"""
        self._is_running = False
        
        if self._cleanup_task:
            self._cleanup_task.cancel()
            try:
                await self._cleanup_task
            except asyncio.CancelledError:
                pass
        
        if self._delivery_task:
            self._delivery_task.cancel()
            try:
                await self._delivery_task
            except asyncio.CancelledError:
                pass
        
        logger.info("Event bus stopped", bus_id=self.bus_id)

    async def publish(
        self,
        event_type: EventType,
        source_agent: str,
        data: Dict[str, Any],
        priority: EventPriority = EventPriority.NORMAL,
        correlation_id: Optional[str] = None,
        tags: Optional[Set[str]] = None,
        ttl_seconds: int = 300,
        delivery_mode: EventDeliveryMode = EventDeliveryMode.AT_LEAST_ONCE
    ) -> str:
        """
        Publish event to the bus
        Returns event ID for tracking
        """
        event_id = str(uuid.uuid4())
        event = Event(
            event_id=event_id,
            event_type=event_type,
            source_agent=source_agent,
            timestamp=datetime.utcnow(),
            priority=priority,
            data=data,
            correlation_id=correlation_id,
            ttl_seconds=ttl_seconds,
            tags=tags or set(),
            metadata={"delivery_mode": delivery_mode.value}
        )
        
        # Store event
        await self.event_buffer.add_event(event)
        
        # Route and deliver event
        await self._route_and_deliver_event(event, delivery_mode)
        
        # Update metrics
        self.metrics["events_published"] += 1
        
        logger.info(
            "Event published",
            event_id=event_id,
            event_type=event_type.value,
            source_agent=source_agent,
            priority=priority.value
        )
        
        return event_id

    async def subscribe(
        self,
        subscriber_id: str,
        event_types: Union[EventType, List[EventType]],
        callback: Callable[[Event], Any],
        filters: Optional[List[Callable[[Event], bool]]] = None,
        priority_threshold: EventPriority = EventPriority.BACKGROUND,
        tags: Optional[Set[str]] = None
    ) -> str:
        """
        Subscribe to events
        Returns subscription ID
        """
        if isinstance(event_types, EventType):
            event_types = [event_types]
        
        subscription_id = f"{subscriber_id}-{uuid.uuid4()}"
        subscription = EventSubscription(
            subscriber_id=subscriber_id,
            event_types=set(event_types),
            callback=callback,
            filters=filters or [],
            priority_threshold=priority_threshold,
            tags=tags or set()
        )
        
        self.subscriptions[subscription_id] = subscription
        self.metrics["active_subscriptions"] = len(self.subscriptions)
        
        logger.info(
            "Event subscription created",
            subscription_id=subscription_id,
            subscriber_id=subscriber_id,
            event_types=[et.value for et in event_types]
        )
        
        return subscription_id

    async def unsubscribe(self, subscription_id: str) -> bool:
        """Remove subscription"""
        if subscription_id in self.subscriptions:
            subscription = self.subscriptions[subscription_id]
            del self.subscriptions[subscription_id]
            self.metrics["active_subscriptions"] = len(self.subscriptions)
            
            logger.info(
                "Event subscription removed",
                subscription_id=subscription_id,
                subscriber_id=subscription.subscriber_id
            )
            return True
        return False

    async def add_route(
        self,
        source_pattern: str,
        target_agents: List[str],
        event_types: Union[EventType, List[EventType]],
        transformation: Optional[Callable[[Event], Event]] = None,
        condition: Optional[Callable[[Event], bool]] = None
    ):
        """Add event routing rule"""
        if isinstance(event_types, EventType):
            event_types = [event_types]
        
        route = EventRoute(
            source_pattern=source_pattern,
            target_agents=target_agents,
            event_types=set(event_types),
            transformation=transformation,
            condition=condition
        )
        
        self.event_routes.append(route)
        
        logger.info(
            "Event route added",
            source_pattern=source_pattern,
            target_agents=target_agents,
            event_types=[et.value for et in event_types]
        )

    async def _route_and_deliver_event(self, event: Event, delivery_mode: EventDeliveryMode):
        """Route event and deliver to subscribers"""
        delivery_tasks = []
        
        # Find matching subscriptions
        matching_subscriptions = await self._find_matching_subscriptions(event)
        
        # Apply routing rules
        routed_targets = await self._apply_routing_rules(event)
        
        # Combine subscription-based and route-based delivery
        all_targets = matching_subscriptions + routed_targets
        
        # Remove duplicates while preserving order
        seen = set()
        unique_targets = []
        for target in all_targets:
            if target not in seen:
                seen.add(target)
                unique_targets.append(target)
        
        # Deliver to all targets
        for subscription_id in unique_targets:
            if subscription_id in self.subscriptions:
                task = asyncio.create_task(
                    self._deliver_to_subscription(event, subscription_id, delivery_mode)
                )
                delivery_tasks.append(task)
        
        # Wait for deliveries based on delivery mode
        if delivery_mode == EventDeliveryMode.FIRE_AND_FORGET:
            # Don't wait for completion
            pass
        elif delivery_mode in [EventDeliveryMode.AT_LEAST_ONCE, EventDeliveryMode.AT_MOST_ONCE]:
            # Wait for all deliveries to complete
            if delivery_tasks:
                await asyncio.gather(*delivery_tasks, return_exceptions=True)
        elif delivery_mode == EventDeliveryMode.EXACTLY_ONCE:
            # Track deliveries for exactly-once semantics
            if delivery_tasks:
                self.pending_deliveries[event.event_id] = {
                    sub_id for sub_id in unique_targets if sub_id in self.subscriptions
                }
                await asyncio.gather(*delivery_tasks, return_exceptions=True)

    async def _find_matching_subscriptions(self, event: Event) -> List[str]:
        """Find subscriptions that match the event"""
        matching_subs = []
        
        for sub_id, subscription in self.subscriptions.items():
            if not subscription.is_active:
                continue
            
            # Check event type
            if event.event_type not in subscription.event_types:
                continue
            
            # Check priority threshold
            if event.priority.value > subscription.priority_threshold.value:
                continue
            
            # Check tags
            if subscription.tags and not subscription.tags.intersection(event.tags):
                continue
            
            # Apply filters
            if subscription.filters:
                if not all(filter_func(event) for filter_func in subscription.filters):
                    continue
            
            matching_subs.append(sub_id)
        
        return matching_subs

    async def _apply_routing_rules(self, event: Event) -> List[str]:
        """Apply routing rules to find additional targets"""
        routed_targets = []
        
        for route in self.event_routes:
            # Check event type
            if event.event_type not in route.event_types:
                continue
            
            # Check source pattern (simple string matching for now)
            if route.source_pattern != "*" and route.source_pattern != event.source_agent:
                continue
            
            # Apply condition
            if route.condition and not route.condition(event):
                continue
            
            # Transform event if needed
            target_event = event
            if route.transformation:
                try:
                    target_event = route.transformation(event)
                except Exception as e:
                    logger.error("Event transformation failed", 
                               route=route.source_pattern, error=str(e))
                    continue
            
            # Add target agents (these would need to be converted to subscription IDs)
            routed_targets.extend(route.target_agents)
        
        return routed_targets

    async def _deliver_to_subscription(
        self,
        event: Event,
        subscription_id: str,
        delivery_mode: EventDeliveryMode
    ):
        """Deliver event to a specific subscription"""
        subscription = self.subscriptions.get(subscription_id)
        if not subscription:
            return
        
        start_time = time.time()
        
        try:
            # Call the subscription callback
            if asyncio.iscoroutinefunction(subscription.callback):
                await subscription.callback(event)
            else:
                subscription.callback(event)
            
            # Track successful delivery
            delivery_time = time.time() - start_time
            self.metrics["events_delivered"] += 1
            
            # Update average delivery time
            current_avg = self.metrics["average_delivery_time"]
            delivered_count = self.metrics["events_delivered"]
            self.metrics["average_delivery_time"] = (
                (current_avg * (delivered_count - 1) + delivery_time) / delivered_count
            )
            
            # Handle exactly-once delivery confirmation
            if delivery_mode == EventDeliveryMode.EXACTLY_ONCE:
                self.delivery_confirmations[event.event_id][subscription_id] = datetime.utcnow()
                if event.event_id in self.pending_deliveries:
                    self.pending_deliveries[event.event_id].discard(subscription_id)
            
            logger.debug(
                "Event delivered successfully",
                event_id=event.event_id,
                subscription_id=subscription_id,
                delivery_time_ms=delivery_time * 1000
            )
            
        except Exception as e:
            self.metrics["failed_deliveries"] += 1
            logger.error(
                "Event delivery failed",
                event_id=event.event_id,
                subscription_id=subscription_id,
                error=str(e)
            )

    async def _cleanup_loop(self):
        """Background task for cleanup operations"""
        while self._is_running:
            try:
                # Clean up expired events
                await self.event_buffer.cleanup_expired_events()
                
                # Clean up old delivery confirmations
                await self._cleanup_delivery_confirmations()
                
                # Clean up inactive subscriptions
                await self._cleanup_inactive_subscriptions()
                
                # Sleep for 30 seconds
                await asyncio.sleep(30)
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error("Cleanup task error", error=str(e))
                await asyncio.sleep(5)

    async def _delivery_monitoring_loop(self):
        """Background task for monitoring event deliveries"""
        while self._is_running:
            try:
                # Check for undelivered events in exactly-once mode
                current_time = datetime.utcnow()
                retry_events = []
                
                for event_id, pending_subs in list(self.pending_deliveries.items()):
                    if pending_subs:  # Still has pending deliveries
                        event = self.event_buffer.index.get(event_id)
                        if event and current_time > event.timestamp + timedelta(seconds=30):
                            retry_events.append((event, list(pending_subs)))
                
                # Retry failed deliveries
                for event, pending_subs in retry_events:
                    logger.warning(
                        "Retrying failed event deliveries",
                        event_id=event.event_id,
                        pending_subscribers=len(pending_subs)
                    )
                    for sub_id in pending_subs:
                        await self._deliver_to_subscription(
                            event, sub_id, EventDeliveryMode.EXACTLY_ONCE
                        )
                
                await asyncio.sleep(10)
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error("Delivery monitoring error", error=str(e))
                await asyncio.sleep(5)

    async def _cleanup_delivery_confirmations(self):
        """Clean up old delivery confirmations"""
        cutoff_time = datetime.utcnow() - timedelta(hours=1)
        
        for event_id in list(self.delivery_confirmations.keys()):
            confirmations = self.delivery_confirmations[event_id]
            # Remove old confirmations
            old_confirmations = [
                sub_id for sub_id, timestamp in confirmations.items()
                if timestamp < cutoff_time
            ]
            for sub_id in old_confirmations:
                del confirmations[sub_id]
            
            # Remove empty entries
            if not confirmations:
                del self.delivery_confirmations[event_id]
        
        # Clean up pending deliveries for old events
        for event_id in list(self.pending_deliveries.keys()):
            event = self.event_buffer.index.get(event_id)
            if not event or event.timestamp < cutoff_time:
                del self.pending_deliveries[event_id]

    async def _cleanup_inactive_subscriptions(self):
        """Remove subscriptions that are no longer active"""
        cutoff_time = datetime.utcnow() - timedelta(hours=24)
        
        inactive_subs = [
            sub_id for sub_id, subscription in self.subscriptions.items()
            if not subscription.is_active or subscription.subscription_time < cutoff_time
        ]
        
        for sub_id in inactive_subs:
            del self.subscriptions[sub_id]
        
        if inactive_subs:
            logger.info(f"Cleaned up {len(inactive_subs)} inactive subscriptions")
            self.metrics["active_subscriptions"] = len(self.subscriptions)

    async def get_events(
        self,
        event_types: Optional[List[EventType]] = None,
        source_agent: Optional[str] = None,
        since: Optional[datetime] = None,
        limit: int = 100
    ) -> List[Event]:
        """Query events from the buffer"""
        if event_types:
            all_events = []
            for event_type in event_types:
                events = await self.event_buffer.get_events_by_type(event_type, limit)
                all_events.extend(events)
        else:
            all_events = await self.event_buffer.get_recent_events(limit)
        
        # Apply filters
        filtered_events = all_events
        
        if source_agent:
            filtered_events = [e for e in filtered_events if e.source_agent == source_agent]
        
        if since:
            filtered_events = [e for e in filtered_events if e.timestamp >= since]
        
        # Sort by timestamp (newest first) and limit
        filtered_events.sort(key=lambda e: e.timestamp, reverse=True)
        return filtered_events[:limit]

    def get_metrics(self) -> Dict[str, Any]:
        """Get event bus performance metrics"""
        return {
            **self.metrics,
            "buffer_size": len(self.event_buffer.events),
            "event_routes": len(self.event_routes),
            "pending_deliveries": sum(len(subs) for subs in self.pending_deliveries.values()),
            "delivery_confirmations": len(self.delivery_confirmations)
        }

    @asynccontextmanager
    async def event_transaction(self):
        """Context manager for transactional event publishing"""
        events_to_publish = []
        
        class TransactionPublisher:
            def add_event(self, event_type: EventType, source_agent: str, data: Dict[str, Any], **kwargs):
                events_to_publish.append((event_type, source_agent, data, kwargs))
        
        publisher = TransactionPublisher()
        
        try:
            yield publisher
            
            # Publish all events if no exception occurred
            for event_type, source_agent, data, kwargs in events_to_publish:
                await self.publish(event_type, source_agent, data, **kwargs)
                
        except Exception:
            # If exception occurred, don't publish any events
            logger.warning(f"Event transaction rolled back, {len(events_to_publish)} events discarded")
            raise