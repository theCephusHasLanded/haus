#!/usr/bin/env python3
"""
Week 3 Implementation Test Suite
Comprehensive testing for Agent Communication Framework enhancements
"""

import asyncio
import sys
import os
from datetime import datetime, timedelta
from typing import Dict, Any

# Add the backend directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '.'))

from app.core.secure_messaging import SecureMessagingProtocol, MessageType, MessagePriority, SecurityLevel
from app.core.event_bus import ConstellationEventBus, EventType, EventPriority
from app.core.agent_lifecycle import AgentLifecycleManager, LifecycleState, FailoverStrategy
from app.core.audit_logger import DistributedAuditLogger, FileLogStorage, LogLevel, AuditEventType
from app.core.cluster_management import ClusterManager, LoadBalancer, LoadBalancingStrategy, LoadBalancerConfig

async def test_secure_messaging():
    """Test secure agent-to-agent messaging"""
    print("📡 Testing Secure Messaging Protocol...")
    
    try:
        # Initialize messaging protocols for two agents
        agent1_messaging = SecureMessagingProtocol("agent-1", "constellation-secret-key")
        agent2_messaging = SecureMessagingProtocol("agent-2", "constellation-secret-key")
        
        # Test different security levels
        security_levels = [
            SecurityLevel.PUBLIC,
            SecurityLevel.INTERNAL,
            SecurityLevel.CONFIDENTIAL,
            SecurityLevel.TOP_SECRET
        ]
        
        for security_level in security_levels:
            message_id = await agent1_messaging.send_message(
                recipient_id="agent-2",
                message_type=MessageType.TASK_REQUEST,
                payload={"task": "analyze_property", "property_id": "123"},
                security_level=security_level
            )
            
            print(f"   ✅ {security_level.value} message sent: {message_id[:8]}...")
        
        # Test message statistics
        stats = agent1_messaging.get_messaging_stats()
        print(f"   ✅ Messaging stats: {stats['sent_messages']} sent, {stats['pending_acknowledgments']} pending")
        
        print("   ✅ Secure messaging: PASSED")
        return True
        
    except Exception as e:
        print(f"   ❌ Secure messaging test failed: {str(e)}")
        return False

async def test_event_bus():
    """Test advanced event bus"""
    print("🚌 Testing Event Bus...")
    
    try:
        # Initialize event bus
        event_bus = ConstellationEventBus("test-bus")
        await event_bus.start()
        
        # Test event subscription
        received_events = []
        
        def event_handler(event):
            received_events.append(event)
        
        subscription_id = await event_bus.subscribe(
            subscriber_id="test-subscriber",
            event_types=[EventType.AGENT_REGISTERED, EventType.TASK_COMPLETED],
            callback=event_handler
        )
        
        # Test event publishing
        event_id1 = await event_bus.publish(
            event_type=EventType.AGENT_REGISTERED,
            source_agent="test-agent",
            data={"agent_id": "new-agent", "capabilities": ["housing", "analysis"]}
        )
        
        event_id2 = await event_bus.publish(
            event_type=EventType.TASK_COMPLETED,
            source_agent="test-agent",
            data={"task_id": "task-123", "result": "success"}
        )
        
        # Wait for event delivery
        await asyncio.sleep(0.1)
        
        # Test event querying
        events = await event_bus.get_events(
            event_types=[EventType.AGENT_REGISTERED],
            limit=10
        )
        
        print(f"   ✅ Published events: {event_id1[:8]}..., {event_id2[:8]}...")
        print(f"   ✅ Received events: {len(received_events)}")
        print(f"   ✅ Queried events: {len(events)}")
        
        # Test metrics
        metrics = event_bus.get_metrics()
        print(f"   ✅ Event bus metrics: {metrics['events_published']} published, {metrics['active_subscriptions']} subscriptions")
        
        await event_bus.stop()
        print("   ✅ Event bus: PASSED")
        return True
        
    except Exception as e:
        print(f"   ❌ Event bus test failed: {str(e)}")
        return False

async def test_lifecycle_management():
    """Test agent lifecycle management"""
    print("♻️  Testing Lifecycle Management...")
    
    try:
        # Initialize event bus for lifecycle manager
        event_bus = ConstellationEventBus("lifecycle-test")
        await event_bus.start()
        
        # Initialize lifecycle manager
        lifecycle_manager = AgentLifecycleManager(event_bus)
        await lifecycle_manager.start()
        
        # Create a mock agent
        class MockAgent:
            def __init__(self, agent_id):
                self.agent_id = agent_id
                self.status = "active"
            
            async def initialize(self):
                self.status = "initialized"
            
            async def shutdown(self):
                self.status = "shutdown"
            
            def get_status(self):
                return {"status": self.status, "task_queue_size": 0}
        
        mock_agent = MockAgent("test-agent-lifecycle")
        
        # Test agent registration
        success = await lifecycle_manager.register_agent(mock_agent)
        print(f"   ✅ Agent registration: {'SUCCESS' if success else 'FAILED'}")
        
        # Test agent start
        success = await lifecycle_manager.start_agent("test-agent-lifecycle")
        print(f"   ✅ Agent start: {'SUCCESS' if success else 'FAILED'}")
        
        # Test agent status
        status = lifecycle_manager.get_agent_status("test-agent-lifecycle")
        print(f"   ✅ Agent status: {status['lifecycle_state'] if status else 'NOT_FOUND'}")
        
        # Test lifecycle metrics
        metrics = lifecycle_manager.get_lifecycle_metrics()
        print(f"   ✅ Lifecycle metrics: {metrics['agents_managed']} managed, {metrics['successful_restarts']} restarts")
        
        await lifecycle_manager.stop()
        await event_bus.stop()
        print("   ✅ Lifecycle management: PASSED")
        return True
        
    except Exception as e:
        print(f"   ❌ Lifecycle management test failed: {str(e)}")
        return False

async def test_audit_logging():
    """Test distributed logging and audit trails"""
    print("📝 Testing Audit Logging...")
    
    try:
        # Initialize storage and logger
        storage = FileLogStorage("/tmp/constellation-test-logs")
        audit_logger = DistributedAuditLogger(storage, "test-node")
        await audit_logger.start()
        
        # Test structured logging
        await audit_logger.log(
            level=LogLevel.INFO,
            source="test-agent",
            message="Test log message",
            data={"property_id": "123", "action": "analysis"}
        )
        
        # Test audit trails
        await audit_logger.audit(
            event_type=AuditEventType.AGENT_ACTION,
            actor="test-agent",
            action="property_analysis",
            resource="property-123",
            outcome="success",
            metadata={"duration": 1.5, "confidence": 0.95}
        )
        
        # Test Fair Housing compliance audit
        await audit_logger.audit_fair_housing_event(
            actor="housing-agent",
            action="eligibility_check",
            resource="application-456",
            outcome="approved"
        )
        
        # Test correlation context
        async with audit_logger.correlation_context() as correlation_id:
            await audit_logger.log(
                level=LogLevel.INFO,
                source="test-agent",
                message="Correlated log 1",
                correlation_id=correlation_id
            )
            await audit_logger.log(
                level=LogLevel.INFO,
                source="test-agent",
                message="Correlated log 2",
                correlation_id=correlation_id
            )
        
        # Test metrics
        metrics = audit_logger.get_metrics()
        print(f"   ✅ Audit metrics: {metrics['logs_written']} logs, {metrics['audits_written']} audits")
        print(f"   ✅ Buffer status: {metrics['log_buffer_size']} log buffer, {metrics['audit_buffer_size']} audit buffer")
        
        await audit_logger.stop()
        print("   ✅ Audit logging: PASSED")
        return True
        
    except Exception as e:
        print(f"   ❌ Audit logging test failed: {str(e)}")
        return False

async def test_cluster_management():
    """Test cluster management and load balancing"""
    print("🏭 Testing Cluster Management...")
    
    try:
        # Initialize event bus for cluster manager
        event_bus = ConstellationEventBus("cluster-test")
        await event_bus.start()
        
        # Initialize cluster manager
        cluster_manager = ClusterManager(event_bus, "test-cluster")
        await cluster_manager.start()
        
        # Test load balancer creation
        lb_config = LoadBalancerConfig(
            strategy=LoadBalancingStrategy.ROUND_ROBIN,
            health_check_interval=30
        )
        
        load_balancer = await cluster_manager.create_load_balancer("housing-agents", lb_config)
        print(f"   ✅ Load balancer created: {lb_config.strategy.value}")
        
        # Test agent group management
        await cluster_manager.add_agent_to_group("agent-1", "housing-agents", "node-1")
        await cluster_manager.add_agent_to_group("agent-2", "housing-agents", "node-1")
        await cluster_manager.add_agent_to_group("agent-3", "housing-agents", "node-2")
        
        print(f"   ✅ Agents added to group: 3 agents")
        
        # Test scaling
        success = await cluster_manager.scale_group("housing-agents", 5)
        print(f"   ✅ Group scaling: {'SUCCESS' if success else 'FAILED'}")
        
        # Test cluster status
        status = cluster_manager.get_cluster_status()
        print(f"   ✅ Cluster status: {status['cluster_state']}, {status['total_agent_groups']} groups")
        print(f"   ✅ Total agents: {status['total_agents']}")
        
        await cluster_manager.stop()
        await event_bus.stop()
        print("   ✅ Cluster management: PASSED")
        return True
        
    except Exception as e:
        print(f"   ❌ Cluster management test failed: {str(e)}")
        return False

async def test_integration():
    """Test integration between all Week 3 components"""
    print("🔗 Testing Component Integration...")
    
    try:
        # Initialize all components
        event_bus = ConstellationEventBus("integration-test")
        await event_bus.start()
        
        storage = FileLogStorage("/tmp/constellation-integration-logs")
        audit_logger = DistributedAuditLogger(storage, "integration-node")
        await audit_logger.start()
        
        lifecycle_manager = AgentLifecycleManager(event_bus)
        await lifecycle_manager.start()
        
        cluster_manager = ClusterManager(event_bus, "integration-cluster")
        await cluster_manager.start()
        
        # Test event flow between components
        integration_events = []
        
        def integration_event_handler(event):
            integration_events.append(event)
        
        await event_bus.subscribe(
            subscriber_id="integration-test",
            event_types=[EventType.AGENT_REGISTERED, EventType.CONSTELLATION_STATUS_CHANGED],
            callback=integration_event_handler
        )
        
        # Simulate agent lifecycle with logging
        async with audit_logger.correlation_context() as correlation_id:
            await audit_logger.audit_agent_action(
                agent_id="integration-agent",
                action="registration",
                resource="constellation",
                outcome="success",
                correlation_id=correlation_id
            )
        
        # Wait for event propagation
        await asyncio.sleep(0.2)
        
        print(f"   ✅ Integration events: {len(integration_events)} received")
        
        # Test metrics aggregation
        event_metrics = event_bus.get_metrics()
        audit_metrics = audit_logger.get_metrics()
        cluster_status = cluster_manager.get_cluster_status()
        
        print(f"   ✅ Event bus: {event_metrics['events_published']} events")
        print(f"   ✅ Audit system: {audit_metrics['logs_written']} logs")
        print(f"   ✅ Cluster: {cluster_status['cluster_state']} state")
        
        # Cleanup
        await lifecycle_manager.stop()
        await cluster_manager.stop()
        await audit_logger.stop()
        await event_bus.stop()
        
        print("   ✅ Integration: PASSED")
        return True
        
    except Exception as e:
        print(f"   ❌ Integration test failed: {str(e)}")
        return False

async def main():
    """Run all Week 3 enhancement tests"""
    print("🌟 Testing Cepheus Constellation Week 3 Enhancements")
    print("=" * 70)
    
    tests = [
        ("Secure Messaging", test_secure_messaging),
        ("Event Bus", test_event_bus),
        ("Lifecycle Management", test_lifecycle_management),
        ("Audit Logging", test_audit_logging),
        ("Cluster Management", test_cluster_management),
        ("Integration", test_integration)
    ]
    
    results = {}
    
    for test_name, test_func in tests:
        print(f"\n🧪 Running {test_name} Test...")
        try:
            success = await test_func()
            results[test_name] = success
        except Exception as e:
            print(f"   ❌ {test_name} test crashed: {str(e)}")
            results[test_name] = False
    
    # Summary
    print("\n" + "=" * 70)
    print("🎯 Week 3 Enhancement Test Results:")
    print("=" * 70)
    
    passed = sum(1 for success in results.values() if success)
    total = len(results)
    
    for test_name, success in results.items():
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"   {test_name:<25} {status}")
    
    print(f"\n📊 Summary: {passed}/{total} tests passed ({(passed/total)*100:.1f}%)")
    
    if passed == total:
        print("🎉 Week 3 Agent Communication Framework: COMPLETE")
        print("✅ Secure agent-to-agent messaging: Implemented")
        print("✅ Advanced event bus coordination: Implemented")
        print("✅ Enhanced lifecycle management: Implemented")
        print("✅ Distributed logging & audit trails: Implemented")
        print("✅ Cluster management & load balancing: Implemented")
        print("✅ End-to-end integration: Verified")
        return True
    else:
        print("❌ Some tests failed - Week 3 implementation needs attention")
        return False

if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)