"""
Agent Cluster Management and Load Balancing
Week 3 Enhancement: Advanced clustering, load balancing, and distributed coordination
"""

import asyncio
import time
from typing import Dict, List, Optional, Any, Set, Callable
from datetime import datetime, timedelta
from dataclasses import dataclass, field
from enum import Enum
import structlog
import uuid
import json
import hashlib
from collections import defaultdict, deque

from app.agents.base import CepheusAgent, AgentStatus, AgentTask
from app.core.event_bus import ConstellationEventBus, EventType, EventPriority

logger = structlog.get_logger(__name__)

class LoadBalancingStrategy(str, Enum):
    """Load balancing strategies"""
    ROUND_ROBIN = "round_robin"
    LEAST_CONNECTIONS = "least_connections"
    WEIGHTED_ROUND_ROBIN = "weighted_round_robin"
    LEAST_RESPONSE_TIME = "least_response_time"
    RESOURCE_BASED = "resource_based"
    HASH_BASED = "hash_based"
    CUSTOM = "custom"

class ClusterState(str, Enum):
    """Cluster operational states"""
    INITIALIZING = "initializing"
    ACTIVE = "active"
    DEGRADED = "degraded"
    MAINTENANCE = "maintenance"
    SCALING = "scaling"
    FAILING = "failing"
    STOPPED = "stopped"

class NodeState(str, Enum):
    """Individual node states"""
    INITIALIZING = "initializing"
    JOINING = "joining"
    ACTIVE = "active"
    DEGRADED = "degraded"
    DRAINING = "draining"
    LEAVING = "leaving"
    FAILED = "failed"
    UNREACHABLE = "unreachable"

@dataclass
class NodeInfo:
    """Information about a cluster node"""
    node_id: str
    hostname: str
    ip_address: str
    port: int
    state: NodeState
    capabilities: Set[str]
    agent_types: Set[str]
    max_agents: int
    current_agents: int
    cpu_usage: float = 0.0
    memory_usage: float = 0.0
    load_average: float = 0.0
    last_heartbeat: datetime = field(default_factory=datetime.utcnow)
    metadata: Dict[str, Any] = field(default_factory=dict)
    weights: Dict[str, float] = field(default_factory=dict)

@dataclass
class AgentInstance:
    """Information about an agent instance"""
    agent_id: str
    agent_type: str
    node_id: str
    state: str
    capabilities: Set[str]
    current_load: int = 0
    max_capacity: int = 100
    response_times: deque = field(default_factory=lambda: deque(maxlen=100))
    error_rate: float = 0.0
    last_activity: datetime = field(default_factory=datetime.utcnow)
    metadata: Dict[str, Any] = field(default_factory=dict)

@dataclass
class LoadBalancerConfig:
    """Load balancer configuration"""
    strategy: LoadBalancingStrategy
    health_check_interval: int = 30
    failure_threshold: int = 3
    recovery_threshold: int = 2
    sticky_sessions: bool = False
    session_timeout: int = 3600
    custom_strategy: Optional[Callable] = None
    weights: Dict[str, float] = field(default_factory=dict)

@dataclass
class ClusterMetrics:
    """Cluster-wide metrics"""
    total_nodes: int = 0
    active_nodes: int = 0
    total_agents: int = 0
    active_agents: int = 0
    average_cpu_usage: float = 0.0
    average_memory_usage: float = 0.0
    total_requests: int = 0
    successful_requests: int = 0
    failed_requests: int = 0
    average_response_time: float = 0.0
    requests_per_second: float = 0.0

class ConsistentHashRing:
    """Consistent hash ring for distributed load balancing"""
    
    def __init__(self, replicas: int = 150):
        self.replicas = replicas
        self.ring: Dict[int, str] = {}
        self.sorted_keys: List[int] = []
        self.nodes: Set[str] = set()

    def _hash(self, key: str) -> int:
        """Generate hash for a key"""
        return int(hashlib.md5(key.encode()).hexdigest(), 16)

    def add_node(self, node_id: str):
        """Add a node to the hash ring"""
        if node_id in self.nodes:
            return
        
        self.nodes.add(node_id)
        
        for i in range(self.replicas):
            replica_key = f"{node_id}:{i}"
            key = self._hash(replica_key)
            self.ring[key] = node_id
        
        self.sorted_keys = sorted(self.ring.keys())

    def remove_node(self, node_id: str):
        """Remove a node from the hash ring"""
        if node_id not in self.nodes:
            return
        
        self.nodes.remove(node_id)
        
        for i in range(self.replicas):
            replica_key = f"{node_id}:{i}"
            key = self._hash(replica_key)
            if key in self.ring:
                del self.ring[key]
        
        self.sorted_keys = sorted(self.ring.keys())

    def get_node(self, key: str) -> Optional[str]:
        """Get the node responsible for a key"""
        if not self.ring:
            return None
        
        hash_key = self._hash(key)
        
        # Find the first node with hash >= hash_key
        for ring_key in self.sorted_keys:
            if ring_key >= hash_key:
                return self.ring[ring_key]
        
        # Wrap around to the first node
        return self.ring[self.sorted_keys[0]]

    def get_nodes(self, key: str, count: int = 1) -> List[str]:
        """Get multiple nodes for redundancy"""
        if not self.ring or count <= 0:
            return []
        
        hash_key = self._hash(key)
        nodes = []
        seen = set()
        
        # Start from the primary node
        start_idx = 0
        for i, ring_key in enumerate(self.sorted_keys):
            if ring_key >= hash_key:
                start_idx = i
                break
        
        # Collect unique nodes
        for i in range(len(self.sorted_keys)):
            idx = (start_idx + i) % len(self.sorted_keys)
            node = self.ring[self.sorted_keys[idx]]
            
            if node not in seen:
                nodes.append(node)
                seen.add(node)
                
                if len(nodes) >= count:
                    break
        
        return nodes

class LoadBalancer:
    """Advanced load balancer with multiple strategies"""
    
    def __init__(self, config: LoadBalancerConfig):
        self.config = config
        self.agent_instances: Dict[str, AgentInstance] = {}
        self.nodes: Dict[str, NodeInfo] = {}
        self.hash_ring = ConsistentHashRing()
        
        # Round robin state
        self._round_robin_index = 0
        
        # Sticky session tracking
        self.session_assignments: Dict[str, str] = {}  # session_id -> agent_id
        self.session_timeouts: Dict[str, datetime] = {}
        
        # Performance tracking
        self.request_history: deque = deque(maxlen=1000)
        self.metrics = ClusterMetrics()

    def add_agent(self, agent_instance: AgentInstance):
        """Add an agent instance to the load balancer"""
        self.agent_instances[agent_instance.agent_id] = agent_instance
        
        # Add to hash ring for hash-based balancing
        self.hash_ring.add_node(agent_instance.agent_id)
        
        logger.info("Agent added to load balancer", agent_id=agent_instance.agent_id)

    def remove_agent(self, agent_id: str):
        """Remove an agent instance from the load balancer"""
        if agent_id in self.agent_instances:
            del self.agent_instances[agent_id]
            self.hash_ring.remove_node(agent_id)
            
            # Clean up session assignments
            self.session_assignments = {
                session_id: assigned_agent
                for session_id, assigned_agent in self.session_assignments.items()
                if assigned_agent != agent_id
            }
            
            logger.info("Agent removed from load balancer", agent_id=agent_id)

    def update_node(self, node_info: NodeInfo):
        """Update node information"""
        self.nodes[node_info.node_id] = node_info

    async def select_agent(
        self,
        task: AgentTask,
        session_id: Optional[str] = None,
        required_capabilities: Optional[Set[str]] = None
    ) -> Optional[str]:
        """Select an agent based on the configured strategy"""
        
        # Filter available agents
        available_agents = self._get_available_agents(required_capabilities)
        
        if not available_agents:
            return None
        
        # Check for sticky session
        if session_id and self.config.sticky_sessions:
            assigned_agent = self._get_sticky_session_agent(session_id, available_agents)
            if assigned_agent:
                return assigned_agent
        
        # Apply load balancing strategy
        selected_agent = None
        
        if self.config.strategy == LoadBalancingStrategy.ROUND_ROBIN:
            selected_agent = self._round_robin_select(available_agents)
        
        elif self.config.strategy == LoadBalancingStrategy.LEAST_CONNECTIONS:
            selected_agent = self._least_connections_select(available_agents)
        
        elif self.config.strategy == LoadBalancingStrategy.WEIGHTED_ROUND_ROBIN:
            selected_agent = self._weighted_round_robin_select(available_agents)
        
        elif self.config.strategy == LoadBalancingStrategy.LEAST_RESPONSE_TIME:
            selected_agent = self._least_response_time_select(available_agents)
        
        elif self.config.strategy == LoadBalancingStrategy.RESOURCE_BASED:
            selected_agent = self._resource_based_select(available_agents)
        
        elif self.config.strategy == LoadBalancingStrategy.HASH_BASED:
            selected_agent = self._hash_based_select(task, available_agents)
        
        elif self.config.strategy == LoadBalancingStrategy.CUSTOM:
            if self.config.custom_strategy:
                selected_agent = self.config.custom_strategy(available_agents, task)
        
        # Set up sticky session if enabled
        if selected_agent and session_id and self.config.sticky_sessions:
            self.session_assignments[session_id] = selected_agent
            self.session_timeouts[session_id] = datetime.utcnow() + timedelta(seconds=self.config.session_timeout)
        
        return selected_agent

    def _get_available_agents(self, required_capabilities: Optional[Set[str]] = None) -> List[str]:
        """Get list of available agents"""
        available = []
        
        for agent_id, agent in self.agent_instances.items():
            # Check if agent is healthy
            if agent.state not in ["active", "healthy"]:
                continue
            
            # Check capacity
            if agent.current_load >= agent.max_capacity:
                continue
            
            # Check capabilities
            if required_capabilities and not required_capabilities.issubset(agent.capabilities):
                continue
            
            # Check if node is available
            node = self.nodes.get(agent.node_id)
            if node and node.state not in [NodeState.ACTIVE]:
                continue
            
            available.append(agent_id)
        
        return available

    def _get_sticky_session_agent(self, session_id: str, available_agents: List[str]) -> Optional[str]:
        """Get agent for sticky session"""
        # Clean up expired sessions
        current_time = datetime.utcnow()
        expired_sessions = [
            sid for sid, timeout in self.session_timeouts.items()
            if timeout < current_time
        ]
        
        for sid in expired_sessions:
            if sid in self.session_assignments:
                del self.session_assignments[sid]
            del self.session_timeouts[sid]
        
        # Check if session has assigned agent
        assigned_agent = self.session_assignments.get(session_id)
        if assigned_agent and assigned_agent in available_agents:
            return assigned_agent
        
        return None

    def _round_robin_select(self, available_agents: List[str]) -> str:
        """Round robin selection"""
        if not available_agents:
            return None
        
        agent = available_agents[self._round_robin_index % len(available_agents)]
        self._round_robin_index += 1
        return agent

    def _least_connections_select(self, available_agents: List[str]) -> str:
        """Select agent with least connections"""
        if not available_agents:
            return None
        
        min_load = float('inf')
        selected_agent = None
        
        for agent_id in available_agents:
            agent = self.agent_instances[agent_id]
            if agent.current_load < min_load:
                min_load = agent.current_load
                selected_agent = agent_id
        
        return selected_agent

    def _weighted_round_robin_select(self, available_agents: List[str]) -> str:
        """Weighted round robin selection"""
        if not available_agents:
            return None
        
        # Simple implementation - in production, you'd want more sophisticated weighting
        weights = []
        for agent_id in available_agents:
            node = self.nodes.get(self.agent_instances[agent_id].node_id)
            weight = self.config.weights.get(agent_id, 1.0)
            if node:
                # Adjust weight based on node performance
                weight *= (1.0 - node.cpu_usage) * (1.0 - node.memory_usage)
            weights.append(weight)
        
        # Select based on weights (simplified)
        total_weight = sum(weights)
        if total_weight == 0:
            return available_agents[0]
        
        import random
        r = random.uniform(0, total_weight)
        cumulative = 0
        for i, weight in enumerate(weights):
            cumulative += weight
            if r <= cumulative:
                return available_agents[i]
        
        return available_agents[-1]

    def _least_response_time_select(self, available_agents: List[str]) -> str:
        """Select agent with least average response time"""
        if not available_agents:
            return None
        
        best_agent = None
        best_time = float('inf')
        
        for agent_id in available_agents:
            agent = self.agent_instances[agent_id]
            if agent.response_times:
                avg_time = sum(agent.response_times) / len(agent.response_times)
                if avg_time < best_time:
                    best_time = avg_time
                    best_agent = agent_id
            elif best_agent is None:
                best_agent = agent_id
        
        return best_agent or available_agents[0]

    def _resource_based_select(self, available_agents: List[str]) -> str:
        """Select agent based on resource availability"""
        if not available_agents:
            return None
        
        best_agent = None
        best_score = -1
        
        for agent_id in available_agents:
            agent = self.agent_instances[agent_id]
            node = self.nodes.get(agent.node_id)
            
            if node:
                # Calculate resource score (higher is better)
                cpu_score = 1.0 - node.cpu_usage
                memory_score = 1.0 - node.memory_usage
                capacity_score = 1.0 - (agent.current_load / agent.max_capacity)
                
                score = (cpu_score + memory_score + capacity_score) / 3.0
                
                if score > best_score:
                    best_score = score
                    best_agent = agent_id
        
        return best_agent or available_agents[0]

    def _hash_based_select(self, task: AgentTask, available_agents: List[str]) -> str:
        """Hash-based selection for consistent routing"""
        if not available_agents:
            return None
        
        # Use task data to create a consistent hash
        task_key = f"{task.task_type}:{task.task_id}"
        selected_node = self.hash_ring.get_node(task_key)
        
        # If the selected node is available, use it
        if selected_node in available_agents:
            return selected_node
        
        # Otherwise, fall back to round robin
        return self._round_robin_select(available_agents)

    async def record_request(self, agent_id: str, response_time: float, success: bool):
        """Record request metrics"""
        current_time = datetime.utcnow()
        
        # Update agent metrics
        if agent_id in self.agent_instances:
            agent = self.agent_instances[agent_id]
            agent.response_times.append(response_time)
            agent.last_activity = current_time
            
            # Update error rate
            if agent.response_times:
                recent_responses = list(agent.response_times)[-10:]  # Last 10 responses
                errors = sum(1 for t in recent_responses if t < 0)  # Negative time indicates error
                agent.error_rate = errors / len(recent_responses)
        
        # Update global metrics
        self.request_history.append({
            'timestamp': current_time,
            'agent_id': agent_id,
            'response_time': response_time,
            'success': success
        })
        
        self.metrics.total_requests += 1
        if success:
            self.metrics.successful_requests += 1
        else:
            self.metrics.failed_requests += 1
        
        # Calculate recent metrics
        recent_requests = [
            r for r in self.request_history
            if (current_time - r['timestamp']).total_seconds() < 60
        ]
        
        if recent_requests:
            self.metrics.requests_per_second = len(recent_requests) / 60.0
            successful_times = [r['response_time'] for r in recent_requests if r['success']]
            if successful_times:
                self.metrics.average_response_time = sum(successful_times) / len(successful_times)

    def get_metrics(self) -> ClusterMetrics:
        """Get current load balancer metrics"""
        # Update current metrics
        self.metrics.total_agents = len(self.agent_instances)
        self.metrics.active_agents = len([
            a for a in self.agent_instances.values()
            if a.state in ["active", "healthy"]
        ])
        
        self.metrics.total_nodes = len(self.nodes)
        self.metrics.active_nodes = len([
            n for n in self.nodes.values()
            if n.state == NodeState.ACTIVE
        ])
        
        # Calculate average resource usage
        if self.nodes:
            total_cpu = sum(n.cpu_usage for n in self.nodes.values())
            total_memory = sum(n.memory_usage for n in self.nodes.values())
            self.metrics.average_cpu_usage = total_cpu / len(self.nodes)
            self.metrics.average_memory_usage = total_memory / len(self.nodes)
        
        return self.metrics

class ClusterManager:
    """
    Advanced cluster management for constellation agents
    """
    
    def __init__(self, event_bus: ConstellationEventBus, cluster_id: str = "constellation-cluster"):
        self.event_bus = event_bus
        self.cluster_id = cluster_id
        self.cluster_state = ClusterState.INITIALIZING
        
        # Cluster components
        self.nodes: Dict[str, NodeInfo] = {}
        self.load_balancers: Dict[str, LoadBalancer] = {}
        self.agent_groups: Dict[str, Set[str]] = defaultdict(set)  # group_name -> agent_ids
        
        # Auto-scaling configuration
        self.scaling_policies: Dict[str, Dict[str, Any]] = {}
        self.min_replicas: Dict[str, int] = {}
        self.max_replicas: Dict[str, int] = {}
        
        # Cluster metrics
        self.cluster_metrics = ClusterMetrics()
        
        # Background tasks
        self._monitoring_task: Optional[asyncio.Task] = None
        self._scaling_task: Optional[asyncio.Task] = None
        self._cleanup_task: Optional[asyncio.Task] = None
        self._is_running = False
        
        logger.info("Cluster manager initialized", cluster_id=cluster_id)

    async def start(self):
        """Start the cluster manager"""
        if self._is_running:
            return
        
        self._is_running = True
        self.cluster_state = ClusterState.ACTIVE
        
        # Start background tasks
        self._monitoring_task = asyncio.create_task(self._monitoring_loop())
        self._scaling_task = asyncio.create_task(self._scaling_loop())
        self._cleanup_task = asyncio.create_task(self._cleanup_loop())
        
        # Publish cluster state change
        await self.event_bus.publish(
            event_type=EventType.CONSTELLATION_STATUS_CHANGED,
            source_agent="cluster-manager",
            data={
                "cluster_id": self.cluster_id,
                "old_state": "initializing",
                "new_state": self.cluster_state.value
            },
            priority=EventPriority.HIGH
        )
        
        logger.info("Cluster manager started")

    async def stop(self):
        """Stop the cluster manager"""
        self._is_running = False
        self.cluster_state = ClusterState.STOPPED
        
        # Stop background tasks
        tasks = [self._monitoring_task, self._scaling_task, self._cleanup_task]
        for task in tasks:
            if task:
                task.cancel()
                try:
                    await task
                except asyncio.CancelledError:
                    pass
        
        logger.info("Cluster manager stopped")

    async def add_node(self, node_info: NodeInfo) -> bool:
        """Add a node to the cluster"""
        try:
            node_info.state = NodeState.JOINING
            self.nodes[node_info.node_id] = node_info
            
            # Update load balancers
            for lb in self.load_balancers.values():
                lb.update_node(node_info)
            
            # Transition to active
            node_info.state = NodeState.ACTIVE
            
            # Publish node addition event
            await self.event_bus.publish(
                event_type=EventType.AGENT_REGISTERED,
                source_agent="cluster-manager",
                data={
                    "node_id": node_info.node_id,
                    "hostname": node_info.hostname,
                    "capabilities": list(node_info.capabilities)
                },
                priority=EventPriority.HIGH
            )
            
            logger.info("Node added to cluster", node_id=node_info.node_id)
            return True
            
        except Exception as e:
            logger.error("Failed to add node", node_id=node_info.node_id, error=str(e))
            return False

    async def remove_node(self, node_id: str, graceful: bool = True) -> bool:
        """Remove a node from the cluster"""
        node = self.nodes.get(node_id)
        if not node:
            return False
        
        try:
            if graceful:
                # Drain node first
                await self._drain_node(node_id)
            
            # Remove from cluster
            del self.nodes[node_id]
            
            # Remove agents from load balancers
            for lb in self.load_balancers.values():
                agents_to_remove = [
                    agent_id for agent_id, agent in lb.agent_instances.items()
                    if agent.node_id == node_id
                ]
                for agent_id in agents_to_remove:
                    lb.remove_agent(agent_id)
            
            # Publish node removal event
            await self.event_bus.publish(
                event_type=EventType.AGENT_UNREGISTERED,
                source_agent="cluster-manager",
                data={"node_id": node_id},
                priority=EventPriority.HIGH
            )
            
            logger.info("Node removed from cluster", node_id=node_id)
            return True
            
        except Exception as e:
            logger.error("Failed to remove node", node_id=node_id, error=str(e))
            return False

    async def create_load_balancer(
        self,
        group_name: str,
        config: LoadBalancerConfig
    ) -> LoadBalancer:
        """Create a load balancer for an agent group"""
        lb = LoadBalancer(config)
        self.load_balancers[group_name] = lb
        
        # Add existing agents to the load balancer
        for agent_id in self.agent_groups.get(group_name, set()):
            # Create agent instance (simplified)
            agent_instance = AgentInstance(
                agent_id=agent_id,
                agent_type=group_name,
                node_id="unknown",  # Would be determined from actual agent
                state="active",
                capabilities=set()
            )
            lb.add_agent(agent_instance)
        
        logger.info("Load balancer created", group_name=group_name, strategy=config.strategy.value)
        return lb

    async def add_agent_to_group(self, agent_id: str, group_name: str, node_id: str):
        """Add an agent to a load balancing group"""
        self.agent_groups[group_name].add(agent_id)
        
        # Add to load balancer if it exists
        if group_name in self.load_balancers:
            agent_instance = AgentInstance(
                agent_id=agent_id,
                agent_type=group_name,
                node_id=node_id,
                state="active",
                capabilities=set()
            )
            self.load_balancers[group_name].add_agent(agent_instance)

    async def remove_agent_from_group(self, agent_id: str, group_name: str):
        """Remove an agent from a load balancing group"""
        if group_name in self.agent_groups:
            self.agent_groups[group_name].discard(agent_id)
        
        # Remove from load balancer
        if group_name in self.load_balancers:
            self.load_balancers[group_name].remove_agent(agent_id)

    async def scale_group(self, group_name: str, target_size: int) -> bool:
        """Scale an agent group to target size"""
        current_size = len(self.agent_groups.get(group_name, set()))
        
        if target_size > current_size:
            # Scale up
            needed = target_size - current_size
            return await self._scale_up_group(group_name, needed)
        elif target_size < current_size:
            # Scale down
            excess = current_size - target_size
            return await self._scale_down_group(group_name, excess)
        
        return True  # Already at target size

    async def _scale_up_group(self, group_name: str, count: int) -> bool:
        """Scale up an agent group"""
        # This would typically involve:
        # 1. Finding available nodes
        # 2. Starting new agent instances
        # 3. Adding them to the load balancer
        
        logger.info("Scaling up agent group", group_name=group_name, count=count)
        
        # Simplified implementation
        for i in range(count):
            agent_id = f"{group_name}-{uuid.uuid4()}"
            # Would start actual agent here
            await self.add_agent_to_group(agent_id, group_name, "auto-scaled-node")
        
        return True

    async def _scale_down_group(self, group_name: str, count: int) -> bool:
        """Scale down an agent group"""
        agents = list(self.agent_groups.get(group_name, set()))
        
        if len(agents) < count:
            count = len(agents)
        
        logger.info("Scaling down agent group", group_name=group_name, count=count)
        
        # Remove agents (simplified)
        for i in range(count):
            agent_id = agents[i]
            await self.remove_agent_from_group(agent_id, group_name)
            # Would stop actual agent here
        
        return True

    async def _drain_node(self, node_id: str):
        """Drain a node before removal"""
        node = self.nodes.get(node_id)
        if not node:
            return
        
        node.state = NodeState.DRAINING
        
        # Stop accepting new tasks and wait for existing tasks to complete
        # This is a simplified implementation
        await asyncio.sleep(30)  # Grace period
        
        logger.info("Node drained", node_id=node_id)

    async def _monitoring_loop(self):
        """Background monitoring loop"""
        while self._is_running:
            try:
                # Update cluster metrics
                await self._update_cluster_metrics()
                
                # Check node health
                await self._check_node_health()
                
                # Check for scaling needs
                await self._check_scaling_needs()
                
                await asyncio.sleep(30)
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error("Monitoring loop error", error=str(e))
                await asyncio.sleep(5)

    async def _scaling_loop(self):
        """Background auto-scaling loop"""
        while self._is_running:
            try:
                # Apply scaling policies
                for group_name, policy in self.scaling_policies.items():
                    await self._apply_scaling_policy(group_name, policy)
                
                await asyncio.sleep(60)  # Check every minute
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error("Scaling loop error", error=str(e))
                await asyncio.sleep(10)

    async def _cleanup_loop(self):
        """Background cleanup loop"""
        while self._is_running:
            try:
                # Clean up failed nodes
                current_time = datetime.utcnow()
                failed_nodes = [
                    node_id for node_id, node in self.nodes.items()
                    if (current_time - node.last_heartbeat).total_seconds() > 300  # 5 minutes
                ]
                
                for node_id in failed_nodes:
                    logger.warning("Node failed heartbeat check", node_id=node_id)
                    await self.remove_node(node_id, graceful=False)
                
                await asyncio.sleep(120)  # Check every 2 minutes
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error("Cleanup loop error", error=str(e))
                await asyncio.sleep(30)

    async def _update_cluster_metrics(self):
        """Update cluster-wide metrics"""
        # Aggregate metrics from all load balancers
        total_requests = 0
        successful_requests = 0
        failed_requests = 0
        response_times = []
        
        for lb in self.load_balancers.values():
            lb_metrics = lb.get_metrics()
            total_requests += lb_metrics.total_requests
            successful_requests += lb_metrics.successful_requests
            failed_requests += lb_metrics.failed_requests
            if lb_metrics.average_response_time > 0:
                response_times.append(lb_metrics.average_response_time)
        
        self.cluster_metrics.total_requests = total_requests
        self.cluster_metrics.successful_requests = successful_requests
        self.cluster_metrics.failed_requests = failed_requests
        
        if response_times:
            self.cluster_metrics.average_response_time = sum(response_times) / len(response_times)

    async def _check_node_health(self):
        """Check health of all nodes"""
        unhealthy_nodes = []
        
        for node_id, node in self.nodes.items():
            # Check heartbeat
            time_since_heartbeat = (datetime.utcnow() - node.last_heartbeat).total_seconds()
            
            if time_since_heartbeat > 180:  # 3 minutes
                if node.state != NodeState.UNREACHABLE:
                    node.state = NodeState.UNREACHABLE
                    unhealthy_nodes.append(node_id)
            
            # Check resource usage
            elif node.cpu_usage > 0.9 or node.memory_usage > 0.9:
                if node.state == NodeState.ACTIVE:
                    node.state = NodeState.DEGRADED
                    logger.warning("Node degraded due to high resource usage", node_id=node_id)
        
        # Handle unhealthy nodes
        for node_id in unhealthy_nodes:
            logger.warning("Node became unreachable", node_id=node_id)
            # Could trigger automatic failover here

    async def _check_scaling_needs(self):
        """Check if any groups need scaling"""
        for group_name, agents in self.agent_groups.items():
            if group_name in self.load_balancers:
                lb = self.load_balancers[group_name]
                lb_metrics = lb.get_metrics()
                
                # Simple scaling logic
                if lb_metrics.average_response_time > 1.0:  # 1 second
                    # Consider scaling up
                    max_size = self.max_replicas.get(group_name, 10)
                    if len(agents) < max_size:
                        logger.info("Considering scale up", group_name=group_name)
                
                elif lb_metrics.average_response_time < 0.1 and len(agents) > 1:
                    # Consider scaling down
                    min_size = self.min_replicas.get(group_name, 1)
                    if len(agents) > min_size:
                        logger.info("Considering scale down", group_name=group_name)

    async def _apply_scaling_policy(self, group_name: str, policy: Dict[str, Any]):
        """Apply auto-scaling policy to a group"""
        # This would implement more sophisticated scaling policies
        # based on metrics like CPU, memory, request rate, etc.
        pass

    def get_cluster_status(self) -> Dict[str, Any]:
        """Get comprehensive cluster status"""
        return {
            "cluster_id": self.cluster_id,
            "cluster_state": self.cluster_state.value,
            "total_nodes": len(self.nodes),
            "active_nodes": len([n for n in self.nodes.values() if n.state == NodeState.ACTIVE]),
            "total_agent_groups": len(self.agent_groups),
            "total_agents": sum(len(agents) for agents in self.agent_groups.values()),
            "load_balancers": {
                name: {
                    "strategy": lb.config.strategy.value,
                    "total_agents": len(lb.agent_instances),
                    "metrics": lb.get_metrics().__dict__
                }
                for name, lb in self.load_balancers.items()
            },
            "cluster_metrics": self.cluster_metrics.__dict__,
            "nodes": {
                node_id: {
                    "state": node.state.value,
                    "hostname": node.hostname,
                    "cpu_usage": node.cpu_usage,
                    "memory_usage": node.memory_usage,
                    "current_agents": node.current_agents,
                    "max_agents": node.max_agents
                }
                for node_id, node in self.nodes.items()
            }
        }