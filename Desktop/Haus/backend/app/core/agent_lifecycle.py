"""
Enhanced Agent Lifecycle Management with Failover
Week 3 Enhancement: Advanced lifecycle management, health monitoring, and automatic failover
"""

import asyncio
import time
from typing import Dict, List, Optional, Any, Callable, Set
from datetime import datetime, timedelta
from dataclasses import dataclass, field
from enum import Enum
import structlog
import uuid
from contextlib import asynccontextmanager

from app.agents.base import CepheusAgent, AgentStatus
from app.core.event_bus import ConstellationEventBus, EventType, EventPriority

logger = structlog.get_logger(__name__)

class LifecycleState(str, Enum):
    """Agent lifecycle states"""
    INITIALIZING = "initializing"
    STARTING = "starting"
    ACTIVE = "active"
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    UNHEALTHY = "unhealthy"
    FAILING = "failing"
    RESTARTING = "restarting"
    STOPPING = "stopping"
    STOPPED = "stopped"
    FAILED = "failed"
    MAINTENANCE = "maintenance"

class FailoverStrategy(str, Enum):
    """Failover strategies for agent management"""
    RESTART_SAME_NODE = "restart_same_node"
    MIGRATE_TO_BACKUP = "migrate_to_backup"
    LOAD_BALANCE_REDIRECT = "load_balance_redirect"
    GRACEFUL_DEGRADATION = "graceful_degradation"
    EMERGENCY_SHUTDOWN = "emergency_shutdown"

@dataclass
class HealthCheck:
    """Health check configuration"""
    check_id: str
    name: str
    check_function: Callable[[], Any]
    interval_seconds: int = 30
    timeout_seconds: int = 10
    failure_threshold: int = 3
    success_threshold: int = 2
    is_critical: bool = False
    metadata: Dict[str, Any] = field(default_factory=dict)

@dataclass
class LifecycleEvent:
    """Lifecycle event data"""
    event_id: str
    agent_id: str
    old_state: LifecycleState
    new_state: LifecycleState
    timestamp: datetime
    reason: str
    metadata: Dict[str, Any] = field(default_factory=dict)

@dataclass
class AgentMetrics:
    """Agent performance and health metrics"""
    cpu_usage: float = 0.0
    memory_usage: float = 0.0
    task_queue_size: int = 0
    processed_tasks: int = 0
    failed_tasks: int = 0
    average_response_time: float = 0.0
    last_activity: Optional[datetime] = None
    error_rate: float = 0.0
    uptime_seconds: float = 0.0

@dataclass
class FailoverConfiguration:
    """Failover configuration for an agent"""
    agent_id: str
    primary_strategy: FailoverStrategy
    backup_strategies: List[FailoverStrategy]
    max_restart_attempts: int = 3
    restart_delay_seconds: int = 5
    health_check_interval: int = 30
    failure_detection_window: int = 300
    backup_agents: List[str] = field(default_factory=list)
    load_balancer_group: Optional[str] = None

class AgentLifecycleManager:
    """
    Advanced agent lifecycle management with health monitoring and failover
    """
    
    def __init__(self, event_bus: ConstellationEventBus):
        self.event_bus = event_bus
        self.managed_agents: Dict[str, CepheusAgent] = {}
        self.agent_states: Dict[str, LifecycleState] = {}
        self.health_checks: Dict[str, List[HealthCheck]] = {}
        self.failover_configs: Dict[str, FailoverConfiguration] = {}
        self.agent_metrics: Dict[str, AgentMetrics] = {}
        
        # Monitoring and management
        self.health_check_results: Dict[str, Dict[str, Any]] = {}
        self.restart_attempts: Dict[str, int] = {}
        self.lifecycle_history: List[LifecycleEvent] = []
        
        # Background tasks
        self._monitoring_task: Optional[asyncio.Task] = None
        self._cleanup_task: Optional[asyncio.Task] = None
        self._is_running = False
        
        # Performance tracking
        self.performance_metrics = {
            "agents_managed": 0,
            "successful_restarts": 0,
            "failed_restarts": 0,
            "failovers_triggered": 0,
            "average_uptime": 0.0
        }
        
        logger.info("Agent lifecycle manager initialized")

    async def start(self):
        """Start the lifecycle manager"""
        if self._is_running:
            return
        
        self._is_running = True
        
        # Start monitoring task
        self._monitoring_task = asyncio.create_task(self._monitoring_loop())
        
        # Start cleanup task
        self._cleanup_task = asyncio.create_task(self._cleanup_loop())
        
        logger.info("Agent lifecycle manager started")

    async def stop(self):
        """Stop the lifecycle manager"""
        self._is_running = False
        
        # Stop all managed agents
        stop_tasks = []
        for agent_id in list(self.managed_agents.keys()):
            task = asyncio.create_task(self.stop_agent(agent_id))
            stop_tasks.append(task)
        
        if stop_tasks:
            await asyncio.gather(*stop_tasks, return_exceptions=True)
        
        # Stop background tasks
        if self._monitoring_task:
            self._monitoring_task.cancel()
            try:
                await self._monitoring_task
            except asyncio.CancelledError:
                pass
        
        if self._cleanup_task:
            self._cleanup_task.cancel()
            try:
                await self._cleanup_task
            except asyncio.CancelledError:
                pass
        
        logger.info("Agent lifecycle manager stopped")

    async def register_agent(
        self,
        agent: CepheusAgent,
        failover_config: Optional[FailoverConfiguration] = None,
        health_checks: Optional[List[HealthCheck]] = None
    ) -> bool:
        """Register an agent for lifecycle management"""
        agent_id = agent.agent_id
        
        try:
            # Store agent and initial state
            self.managed_agents[agent_id] = agent
            self.agent_states[agent_id] = LifecycleState.INITIALIZING
            self.agent_metrics[agent_id] = AgentMetrics()
            self.restart_attempts[agent_id] = 0
            
            # Set up failover configuration
            if failover_config:
                self.failover_configs[agent_id] = failover_config
            else:
                self.failover_configs[agent_id] = FailoverConfiguration(
                    agent_id=agent_id,
                    primary_strategy=FailoverStrategy.RESTART_SAME_NODE,
                    backup_strategies=[FailoverStrategy.GRACEFUL_DEGRADATION]
                )
            
            # Set up health checks
            if health_checks:
                self.health_checks[agent_id] = health_checks
            else:
                # Add default health checks
                self.health_checks[agent_id] = [
                    HealthCheck(
                        check_id=f"{agent_id}-basic-health",
                        name="Basic Health Check",
                        check_function=lambda: agent.get_status(),
                        interval_seconds=30,
                        is_critical=True
                    )
                ]
            
            # Record lifecycle event
            await self._record_lifecycle_event(
                agent_id, LifecycleState.INITIALIZING, LifecycleState.STARTING,
                "Agent registered for lifecycle management"
            )
            
            # Initialize health check results
            self.health_check_results[agent_id] = {}
            
            # Update metrics
            self.performance_metrics["agents_managed"] = len(self.managed_agents)
            
            logger.info("Agent registered for lifecycle management", agent_id=agent_id)
            return True
            
        except Exception as e:
            logger.error("Failed to register agent", agent_id=agent_id, error=str(e))
            return False

    async def start_agent(self, agent_id: str) -> bool:
        """Start a managed agent"""
        agent = self.managed_agents.get(agent_id)
        if not agent:
            logger.error("Agent not found", agent_id=agent_id)
            return False
        
        try:
            current_state = self.agent_states[agent_id]
            
            if current_state in [LifecycleState.ACTIVE, LifecycleState.HEALTHY]:
                logger.warning("Agent already active", agent_id=agent_id)
                return True
            
            # Transition to starting state
            await self._transition_state(agent_id, LifecycleState.STARTING, "Manual start requested")
            
            # Initialize agent
            await agent.initialize()
            
            # Transition to active state
            await self._transition_state(agent_id, LifecycleState.ACTIVE, "Agent started successfully")
            
            # Reset restart attempts
            self.restart_attempts[agent_id] = 0
            
            # Update metrics
            metrics = self.agent_metrics[agent_id]
            metrics.last_activity = datetime.utcnow()
            
            logger.info("Agent started successfully", agent_id=agent_id)
            return True
            
        except Exception as e:
            await self._transition_state(agent_id, LifecycleState.FAILED, f"Start failed: {str(e)}")
            logger.error("Failed to start agent", agent_id=agent_id, error=str(e))
            return False

    async def stop_agent(self, agent_id: str, graceful: bool = True) -> bool:
        """Stop a managed agent"""
        agent = self.managed_agents.get(agent_id)
        if not agent:
            logger.error("Agent not found", agent_id=agent_id)
            return False
        
        try:
            # Transition to stopping state
            await self._transition_state(agent_id, LifecycleState.STOPPING, "Stop requested")
            
            if graceful:
                # Try graceful shutdown first
                await agent.shutdown()
            else:
                # Force stop if needed
                await agent.shutdown()
            
            # Transition to stopped state
            await self._transition_state(agent_id, LifecycleState.STOPPED, "Agent stopped")
            
            logger.info("Agent stopped", agent_id=agent_id, graceful=graceful)
            return True
            
        except Exception as e:
            await self._transition_state(agent_id, LifecycleState.FAILED, f"Stop failed: {str(e)}")
            logger.error("Failed to stop agent", agent_id=agent_id, error=str(e))
            return False

    async def restart_agent(self, agent_id: str) -> bool:
        """Restart a managed agent"""
        try:
            # Increment restart attempts
            self.restart_attempts[agent_id] = self.restart_attempts.get(agent_id, 0) + 1
            
            # Check if max restart attempts exceeded
            failover_config = self.failover_configs.get(agent_id)
            if failover_config and self.restart_attempts[agent_id] > failover_config.max_restart_attempts:
                logger.error("Max restart attempts exceeded", 
                           agent_id=agent_id, 
                           attempts=self.restart_attempts[agent_id])
                await self._trigger_failover(agent_id, "Max restart attempts exceeded")
                return False
            
            # Transition to restarting state
            await self._transition_state(agent_id, LifecycleState.RESTARTING, "Restart initiated")
            
            # Stop agent if it's running
            current_state = self.agent_states[agent_id]
            if current_state not in [LifecycleState.STOPPED, LifecycleState.FAILED]:
                await self.stop_agent(agent_id, graceful=False)
            
            # Wait before restart if configured
            if failover_config and failover_config.restart_delay_seconds > 0:
                await asyncio.sleep(failover_config.restart_delay_seconds)
            
            # Start agent
            success = await self.start_agent(agent_id)
            
            if success:
                self.performance_metrics["successful_restarts"] += 1
                logger.info("Agent restarted successfully", agent_id=agent_id)
            else:
                self.performance_metrics["failed_restarts"] += 1
                logger.error("Agent restart failed", agent_id=agent_id)
            
            return success
            
        except Exception as e:
            self.performance_metrics["failed_restarts"] += 1
            await self._transition_state(agent_id, LifecycleState.FAILED, f"Restart failed: {str(e)}")
            logger.error("Agent restart failed", agent_id=agent_id, error=str(e))
            return False

    async def _monitoring_loop(self):
        """Background monitoring loop"""
        while self._is_running:
            try:
                # Run health checks for all managed agents
                check_tasks = []
                for agent_id in list(self.managed_agents.keys()):
                    task = asyncio.create_task(self._run_health_checks(agent_id))
                    check_tasks.append(task)
                
                if check_tasks:
                    await asyncio.gather(*check_tasks, return_exceptions=True)
                
                # Update agent metrics
                await self._update_agent_metrics()
                
                # Check for agents needing failover
                await self._check_failover_conditions()
                
                # Sleep before next monitoring cycle
                await asyncio.sleep(10)
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error("Monitoring loop error", error=str(e))
                await asyncio.sleep(5)

    async def _run_health_checks(self, agent_id: str):
        """Run health checks for a specific agent"""
        agent = self.managed_agents.get(agent_id)
        if not agent:
            return
        
        health_checks = self.health_checks.get(agent_id, [])
        agent_health_results = self.health_check_results.get(agent_id, {})
        
        for health_check in health_checks:
            try:
                # Check if it's time to run this health check
                last_check = agent_health_results.get(health_check.check_id, {}).get('last_check')
                if last_check:
                    time_since_last = (datetime.utcnow() - last_check).total_seconds()
                    if time_since_last < health_check.interval_seconds:
                        continue
                
                # Run health check with timeout
                start_time = time.time()
                
                try:
                    result = await asyncio.wait_for(
                        self._execute_health_check(health_check),
                        timeout=health_check.timeout_seconds
                    )
                    
                    # Record successful check
                    agent_health_results[health_check.check_id] = {
                        'status': 'healthy',
                        'result': result,
                        'last_check': datetime.utcnow(),
                        'duration': time.time() - start_time,
                        'consecutive_failures': 0
                    }
                    
                except asyncio.TimeoutError:
                    # Health check timed out
                    consecutive_failures = agent_health_results.get(health_check.check_id, {}).get('consecutive_failures', 0) + 1
                    
                    agent_health_results[health_check.check_id] = {
                        'status': 'timeout',
                        'result': None,
                        'last_check': datetime.utcnow(),
                        'duration': health_check.timeout_seconds,
                        'consecutive_failures': consecutive_failures
                    }
                    
                    # Check if failure threshold exceeded
                    if consecutive_failures >= health_check.failure_threshold:
                        await self._handle_health_check_failure(agent_id, health_check, "Health check timeout")
                
            except Exception as e:
                # Health check failed
                consecutive_failures = agent_health_results.get(health_check.check_id, {}).get('consecutive_failures', 0) + 1
                
                agent_health_results[health_check.check_id] = {
                    'status': 'failed',
                    'result': None,
                    'error': str(e),
                    'last_check': datetime.utcnow(),
                    'duration': time.time() - start_time,
                    'consecutive_failures': consecutive_failures
                }
                
                # Check if failure threshold exceeded
                if consecutive_failures >= health_check.failure_threshold:
                    await self._handle_health_check_failure(agent_id, health_check, str(e))
        
        self.health_check_results[agent_id] = agent_health_results

    async def _execute_health_check(self, health_check: HealthCheck) -> Any:
        """Execute a health check function"""
        if asyncio.iscoroutinefunction(health_check.check_function):
            return await health_check.check_function()
        else:
            return health_check.check_function()

    async def _handle_health_check_failure(self, agent_id: str, health_check: HealthCheck, error: str):
        """Handle health check failure"""
        current_state = self.agent_states.get(agent_id)
        
        if health_check.is_critical:
            # Critical health check failed - mark agent as unhealthy
            if current_state not in [LifecycleState.UNHEALTHY, LifecycleState.FAILING]:
                await self._transition_state(agent_id, LifecycleState.UNHEALTHY, 
                                           f"Critical health check failed: {health_check.name}")
        else:
            # Non-critical health check failed - mark as degraded
            if current_state == LifecycleState.HEALTHY:
                await self._transition_state(agent_id, LifecycleState.DEGRADED,
                                           f"Health check failed: {health_check.name}")
        
        logger.warning("Health check failed", 
                      agent_id=agent_id, 
                      check_name=health_check.name,
                      error=error)

    async def _update_agent_metrics(self):
        """Update metrics for all managed agents"""
        for agent_id, agent in self.managed_agents.items():
            try:
                # Get agent status and update metrics
                status = agent.get_status()
                metrics = self.agent_metrics[agent_id]
                
                # Update basic metrics from agent status
                if hasattr(status, 'task_queue_size'):
                    metrics.task_queue_size = status.task_queue_size
                if hasattr(status, 'processed_tasks'):
                    metrics.processed_tasks = status.processed_tasks
                if hasattr(status, 'failed_tasks'):
                    metrics.failed_tasks = status.failed_tasks
                
                # Calculate error rate
                total_tasks = metrics.processed_tasks + metrics.failed_tasks
                if total_tasks > 0:
                    metrics.error_rate = metrics.failed_tasks / total_tasks
                
                # Update last activity
                metrics.last_activity = datetime.utcnow()
                
            except Exception as e:
                logger.error("Failed to update agent metrics", agent_id=agent_id, error=str(e))

    async def _check_failover_conditions(self):
        """Check if any agents need failover"""
        for agent_id in list(self.managed_agents.keys()):
            current_state = self.agent_states.get(agent_id)
            
            # Check if agent is in a failing state
            if current_state == LifecycleState.UNHEALTHY:
                # Agent is unhealthy - consider failover
                await self._consider_failover(agent_id, "Agent is unhealthy")
            
            elif current_state == LifecycleState.FAILED:
                # Agent has failed - trigger failover
                await self._trigger_failover(agent_id, "Agent has failed")

    async def _consider_failover(self, agent_id: str, reason: str):
        """Consider whether to trigger failover for an agent"""
        failover_config = self.failover_configs.get(agent_id)
        if not failover_config:
            return
        
        # Check restart attempts
        if self.restart_attempts.get(agent_id, 0) < failover_config.max_restart_attempts:
            # Try restart first
            logger.info("Attempting restart before failover", agent_id=agent_id, reason=reason)
            await self.restart_agent(agent_id)
        else:
            # Max restarts exceeded - trigger failover
            await self._trigger_failover(agent_id, f"Max restarts exceeded: {reason}")

    async def _trigger_failover(self, agent_id: str, reason: str):
        """Trigger failover for an agent"""
        failover_config = self.failover_configs.get(agent_id)
        if not failover_config:
            logger.error("No failover configuration found", agent_id=agent_id)
            return
        
        logger.warning("Triggering failover", agent_id=agent_id, reason=reason)
        
        # Try primary failover strategy
        success = await self._execute_failover_strategy(agent_id, failover_config.primary_strategy, reason)
        
        if not success:
            # Try backup strategies
            for backup_strategy in failover_config.backup_strategies:
                success = await self._execute_failover_strategy(agent_id, backup_strategy, reason)
                if success:
                    break
        
        if success:
            self.performance_metrics["failovers_triggered"] += 1
            logger.info("Failover completed successfully", agent_id=agent_id)
        else:
            logger.error("All failover strategies failed", agent_id=agent_id)
            await self._transition_state(agent_id, LifecycleState.FAILED, "All failover strategies failed")

    async def _execute_failover_strategy(self, agent_id: str, strategy: FailoverStrategy, reason: str) -> bool:
        """Execute a specific failover strategy"""
        try:
            if strategy == FailoverStrategy.RESTART_SAME_NODE:
                return await self.restart_agent(agent_id)
            
            elif strategy == FailoverStrategy.MIGRATE_TO_BACKUP:
                return await self._migrate_to_backup(agent_id)
            
            elif strategy == FailoverStrategy.LOAD_BALANCE_REDIRECT:
                return await self._redirect_to_load_balancer(agent_id)
            
            elif strategy == FailoverStrategy.GRACEFUL_DEGRADATION:
                return await self._graceful_degradation(agent_id)
            
            elif strategy == FailoverStrategy.EMERGENCY_SHUTDOWN:
                return await self._emergency_shutdown(agent_id)
            
            else:
                logger.error("Unknown failover strategy", strategy=strategy)
                return False
                
        except Exception as e:
            logger.error("Failover strategy execution failed", 
                        agent_id=agent_id, strategy=strategy, error=str(e))
            return False

    async def _migrate_to_backup(self, agent_id: str) -> bool:
        """Migrate agent to backup node"""
        # This would involve coordination with cluster management
        # For now, return False as not implemented
        logger.warning("Backup migration not implemented", agent_id=agent_id)
        return False

    async def _redirect_to_load_balancer(self, agent_id: str) -> bool:
        """Redirect traffic to load balancer"""
        # This would involve updating load balancer configuration
        # For now, return False as not implemented
        logger.warning("Load balancer redirect not implemented", agent_id=agent_id)
        return False

    async def _graceful_degradation(self, agent_id: str) -> bool:
        """Enable graceful degradation mode"""
        try:
            await self._transition_state(agent_id, LifecycleState.DEGRADED, "Graceful degradation enabled")
            # Agent continues to run but with reduced functionality
            return True
        except Exception as e:
            logger.error("Graceful degradation failed", agent_id=agent_id, error=str(e))
            return False

    async def _emergency_shutdown(self, agent_id: str) -> bool:
        """Emergency shutdown of agent"""
        try:
            await self.stop_agent(agent_id, graceful=False)
            return True
        except Exception as e:
            logger.error("Emergency shutdown failed", agent_id=agent_id, error=str(e))
            return False

    async def _transition_state(self, agent_id: str, new_state: LifecycleState, reason: str):
        """Transition agent to new lifecycle state"""
        old_state = self.agent_states.get(agent_id, LifecycleState.INITIALIZING)
        self.agent_states[agent_id] = new_state
        
        # Record lifecycle event
        await self._record_lifecycle_event(agent_id, old_state, new_state, reason)
        
        # Publish event to event bus
        await self.event_bus.publish(
            event_type=EventType.AGENT_STATUS_CHANGED,
            source_agent="lifecycle-manager",
            data={
                "agent_id": agent_id,
                "old_state": old_state.value,
                "new_state": new_state.value,
                "reason": reason
            },
            priority=EventPriority.HIGH
        )

    async def _record_lifecycle_event(self, agent_id: str, old_state: LifecycleState, new_state: LifecycleState, reason: str):
        """Record a lifecycle event"""
        event = LifecycleEvent(
            event_id=str(uuid.uuid4()),
            agent_id=agent_id,
            old_state=old_state,
            new_state=new_state,
            timestamp=datetime.utcnow(),
            reason=reason
        )
        
        self.lifecycle_history.append(event)
        
        logger.info("Agent state transition", 
                   agent_id=agent_id,
                   old_state=old_state.value,
                   new_state=new_state.value,
                   reason=reason)

    async def _cleanup_loop(self):
        """Background cleanup task"""
        while self._is_running:
            try:
                # Clean up old lifecycle events
                cutoff_time = datetime.utcnow() - timedelta(hours=24)
                self.lifecycle_history = [
                    event for event in self.lifecycle_history
                    if event.timestamp > cutoff_time
                ]
                
                # Clean up old health check results
                for agent_id in list(self.health_check_results.keys()):
                    if agent_id not in self.managed_agents:
                        del self.health_check_results[agent_id]
                
                await asyncio.sleep(300)  # Run every 5 minutes
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error("Cleanup task error", error=str(e))
                await asyncio.sleep(30)

    def get_agent_status(self, agent_id: str) -> Optional[Dict[str, Any]]:
        """Get comprehensive status for an agent"""
        if agent_id not in self.managed_agents:
            return None
        
        agent = self.managed_agents[agent_id]
        state = self.agent_states.get(agent_id)
        metrics = self.agent_metrics.get(agent_id)
        health_results = self.health_check_results.get(agent_id, {})
        
        # Calculate overall health score
        health_score = self._calculate_health_score(agent_id)
        
        return {
            "agent_id": agent_id,
            "lifecycle_state": state.value if state else "unknown",
            "agent_status": agent.get_status().__dict__ if hasattr(agent.get_status(), '__dict__') else str(agent.get_status()),
            "health_score": health_score,
            "metrics": metrics.__dict__ if metrics else {},
            "health_checks": {
                check_id: {
                    "status": result.get('status'),
                    "last_check": result.get('last_check').isoformat() if result.get('last_check') else None,
                    "consecutive_failures": result.get('consecutive_failures', 0)
                }
                for check_id, result in health_results.items()
            },
            "restart_attempts": self.restart_attempts.get(agent_id, 0),
            "failover_config": self.failover_configs.get(agent_id).__dict__ if agent_id in self.failover_configs else None
        }

    def _calculate_health_score(self, agent_id: str) -> float:
        """Calculate overall health score for an agent"""
        health_results = self.health_check_results.get(agent_id, {})
        if not health_results:
            return 100.0
        
        total_checks = len(health_results)
        healthy_checks = sum(1 for result in health_results.values() 
                           if result.get('status') == 'healthy')
        
        return (healthy_checks / total_checks) * 100.0

    def get_lifecycle_metrics(self) -> Dict[str, Any]:
        """Get lifecycle management metrics"""
        # Calculate average uptime
        total_uptime = 0.0
        active_agents = 0
        
        for agent_id, metrics in self.agent_metrics.items():
            state = self.agent_states.get(agent_id)
            if state in [LifecycleState.ACTIVE, LifecycleState.HEALTHY, LifecycleState.DEGRADED]:
                if metrics.last_activity:
                    uptime = (datetime.utcnow() - metrics.last_activity).total_seconds()
                    total_uptime += uptime
                    active_agents += 1
        
        average_uptime = total_uptime / active_agents if active_agents > 0 else 0.0
        
        return {
            **self.performance_metrics,
            "average_uptime": average_uptime,
            "total_lifecycle_events": len(self.lifecycle_history),
            "agents_by_state": {
                state.value: sum(1 for s in self.agent_states.values() if s == state)
                for state in LifecycleState
            }
        }