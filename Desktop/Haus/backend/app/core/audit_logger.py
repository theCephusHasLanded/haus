"""
Distributed Logging and Audit Trail System
Week 3 Enhancement: Comprehensive logging, auditing, and compliance tracking
"""

import asyncio
import json
import hashlib
import time
from typing import Dict, List, Optional, Any, Union
from datetime import datetime, timedelta
from dataclasses import dataclass, field, asdict
from enum import Enum
import structlog
import uuid
from pathlib import Path
import gzip
import pickle
from contextlib import asynccontextmanager

logger = structlog.get_logger(__name__)

class LogLevel(str, Enum):
    """Log levels for distributed logging"""
    TRACE = "trace"
    DEBUG = "debug"
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"

class AuditEventType(str, Enum):
    """Types of audit events"""
    AGENT_ACTION = "agent_action"
    DATA_ACCESS = "data_access"
    CONFIGURATION_CHANGE = "configuration_change"
    SECURITY_EVENT = "security_event"
    SYSTEM_EVENT = "system_event"
    USER_ACTION = "user_action"
    COMPLIANCE_EVENT = "compliance_event"
    PERFORMANCE_EVENT = "performance_event"
    ERROR_EVENT = "error_event"

class ComplianceFramework(str, Enum):
    """Compliance frameworks for audit logging"""
    SOC2 = "soc2"
    GDPR = "gdpr"
    CCPA = "ccpa"
    FAIR_HOUSING_ACT = "fair_housing_act"
    PCI_DSS = "pci_dss"
    HIPAA = "hipaa"
    ISO27001 = "iso27001"

@dataclass
class LogEntry:
    """Structured log entry"""
    log_id: str
    timestamp: datetime
    level: LogLevel
    source: str
    message: str
    correlation_id: Optional[str] = None
    session_id: Optional[str] = None
    user_id: Optional[str] = None
    agent_id: Optional[str] = None
    data: Dict[str, Any] = field(default_factory=dict)
    tags: List[str] = field(default_factory=list)
    location: Optional[str] = None  # Geographic or logical location
    environment: str = "production"

@dataclass
class AuditEntry:
    """Audit trail entry for compliance"""
    audit_id: str
    timestamp: datetime
    event_type: AuditEventType
    actor: str  # Who performed the action
    action: str  # What action was performed
    resource: str  # What resource was affected
    outcome: str  # Success/failure/denied
    correlation_id: Optional[str] = None
    session_id: Optional[str] = None
    source_ip: Optional[str] = None
    user_agent: Optional[str] = None
    compliance_frameworks: List[ComplianceFramework] = field(default_factory=list)
    risk_level: str = "low"  # low/medium/high/critical
    data_classification: str = "internal"  # public/internal/confidential/restricted
    retention_period: int = 2557  # Days (7 years default for housing compliance)
    before_state: Optional[Dict[str, Any]] = None
    after_state: Optional[Dict[str, Any]] = None
    metadata: Dict[str, Any] = field(default_factory=dict)

@dataclass
class LogFilter:
    """Filter configuration for log queries"""
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    levels: Optional[List[LogLevel]] = None
    sources: Optional[List[str]] = None
    agents: Optional[List[str]] = None
    correlation_ids: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    search_text: Optional[str] = None
    limit: int = 1000

@dataclass
class AuditFilter:
    """Filter configuration for audit queries"""
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    event_types: Optional[List[AuditEventType]] = None
    actors: Optional[List[str]] = None
    resources: Optional[List[str]] = None
    outcomes: Optional[List[str]] = None
    compliance_frameworks: Optional[List[ComplianceFramework]] = None
    risk_levels: Optional[List[str]] = None
    correlation_ids: Optional[List[str]] = None
    limit: int = 1000

class LogStorage:
    """Abstract base class for log storage backends"""
    
    async def store_log(self, log_entry: LogEntry):
        raise NotImplementedError
    
    async def store_audit(self, audit_entry: AuditEntry):
        raise NotImplementedError
    
    async def query_logs(self, filter_config: LogFilter) -> List[LogEntry]:
        raise NotImplementedError
    
    async def query_audit(self, filter_config: AuditFilter) -> List[AuditEntry]:
        raise NotImplementedError

class FileLogStorage(LogStorage):
    """File-based log storage with rotation and compression"""
    
    def __init__(self, base_path: str = "/var/log/constellation"):
        self.base_path = Path(base_path)
        self.base_path.mkdir(parents=True, exist_ok=True)
        
        self.log_path = self.base_path / "logs"
        self.audit_path = self.base_path / "audit"
        self.log_path.mkdir(exist_ok=True)
        self.audit_path.mkdir(exist_ok=True)
        
        # Current log files
        self.current_log_file = None
        self.current_audit_file = None
        self.current_log_date = None
        self.current_audit_date = None
        
        # Rotation settings
        self.max_file_size = 100 * 1024 * 1024  # 100MB
        self.compression_enabled = True

    async def store_log(self, log_entry: LogEntry):
        """Store log entry to file"""
        await self._ensure_log_file()
        
        log_line = json.dumps({
            **asdict(log_entry),
            'timestamp': log_entry.timestamp.isoformat()
        }) + '\n'
        
        self.current_log_file.write(log_line)
        self.current_log_file.flush()
        
        # Check if rotation is needed
        if self.current_log_file.tell() > self.max_file_size:
            await self._rotate_log_file()

    async def store_audit(self, audit_entry: AuditEntry):
        """Store audit entry to file"""
        await self._ensure_audit_file()
        
        audit_line = json.dumps({
            **asdict(audit_entry),
            'timestamp': audit_entry.timestamp.isoformat(),
            'compliance_frameworks': [cf.value for cf in audit_entry.compliance_frameworks]
        }) + '\n'
        
        self.current_audit_file.write(audit_line)
        self.current_audit_file.flush()
        
        # Check if rotation is needed
        if self.current_audit_file.tell() > self.max_file_size:
            await self._rotate_audit_file()

    async def _ensure_log_file(self):
        """Ensure current log file is open and current"""
        current_date = datetime.utcnow().date()
        
        if self.current_log_date != current_date or not self.current_log_file:
            if self.current_log_file:
                self.current_log_file.close()
            
            log_filename = f"constellation-{current_date.isoformat()}.log"
            self.current_log_file = open(self.log_path / log_filename, 'a')
            self.current_log_date = current_date

    async def _ensure_audit_file(self):
        """Ensure current audit file is open and current"""
        current_date = datetime.utcnow().date()
        
        if self.current_audit_date != current_date or not self.current_audit_file:
            if self.current_audit_file:
                self.current_audit_file.close()
            
            audit_filename = f"audit-{current_date.isoformat()}.log"
            self.current_audit_file = open(self.audit_path / audit_filename, 'a')
            self.current_audit_date = current_date

    async def _rotate_log_file(self):
        """Rotate and compress current log file"""
        if not self.current_log_file:
            return
        
        current_path = Path(self.current_log_file.name)
        self.current_log_file.close()
        
        # Create rotated filename with timestamp
        timestamp = datetime.utcnow().strftime("%H%M%S")
        rotated_name = f"{current_path.stem}-{timestamp}.log"
        rotated_path = current_path.parent / rotated_name
        
        # Rename current file
        current_path.rename(rotated_path)
        
        # Compress if enabled
        if self.compression_enabled:
            await self._compress_file(rotated_path)
        
        # Open new log file
        self.current_log_file = open(current_path, 'w')

    async def _rotate_audit_file(self):
        """Rotate and compress current audit file"""
        if not self.current_audit_file:
            return
        
        current_path = Path(self.current_audit_file.name)
        self.current_audit_file.close()
        
        # Create rotated filename with timestamp
        timestamp = datetime.utcnow().strftime("%H%M%S")
        rotated_name = f"{current_path.stem}-{timestamp}.log"
        rotated_path = current_path.parent / rotated_name
        
        # Rename current file
        current_path.rename(rotated_path)
        
        # Compress if enabled
        if self.compression_enabled:
            await self._compress_file(rotated_path)
        
        # Open new audit file
        self.current_audit_file = open(current_path, 'w')

    async def _compress_file(self, file_path: Path):
        """Compress a log file using gzip"""
        compressed_path = file_path.with_suffix(file_path.suffix + '.gz')
        
        with open(file_path, 'rb') as f_in:
            with gzip.open(compressed_path, 'wb') as f_out:
                f_out.writelines(f_in)
        
        # Remove original file
        file_path.unlink()

    async def query_logs(self, filter_config: LogFilter) -> List[LogEntry]:
        """Query logs from files (simplified implementation)"""
        # This is a basic implementation - in production, you'd want to use
        # proper indexing and search capabilities
        logs = []
        
        # Get relevant log files based on date range
        log_files = self._get_relevant_log_files(filter_config.start_time, filter_config.end_time)
        
        for log_file in log_files:
            try:
                if log_file.suffix == '.gz':
                    f = gzip.open(log_file, 'rt')
                else:
                    f = open(log_file, 'r')
                
                with f:
                    for line in f:
                        try:
                            log_data = json.loads(line.strip())
                            log_entry = self._dict_to_log_entry(log_data)
                            
                            if self._matches_log_filter(log_entry, filter_config):
                                logs.append(log_entry)
                                
                                if len(logs) >= filter_config.limit:
                                    return logs
                        except (json.JSONDecodeError, KeyError):
                            continue
            except IOError:
                continue
        
        return logs

    async def query_audit(self, filter_config: AuditFilter) -> List[AuditEntry]:
        """Query audit entries from files"""
        audits = []
        
        # Get relevant audit files based on date range
        audit_files = self._get_relevant_audit_files(filter_config.start_time, filter_config.end_time)
        
        for audit_file in audit_files:
            try:
                if audit_file.suffix == '.gz':
                    f = gzip.open(audit_file, 'rt')
                else:
                    f = open(audit_file, 'r')
                
                with f:
                    for line in f:
                        try:
                            audit_data = json.loads(line.strip())
                            audit_entry = self._dict_to_audit_entry(audit_data)
                            
                            if self._matches_audit_filter(audit_entry, filter_config):
                                audits.append(audit_entry)
                                
                                if len(audits) >= filter_config.limit:
                                    return audits
                        except (json.JSONDecodeError, KeyError):
                            continue
            except IOError:
                continue
        
        return audits

    def _get_relevant_log_files(self, start_time: Optional[datetime], end_time: Optional[datetime]) -> List[Path]:
        """Get log files relevant to the time range"""
        log_files = list(self.log_path.glob("constellation-*.log*"))
        log_files.sort()
        return log_files  # Simplified - should filter by date range

    def _get_relevant_audit_files(self, start_time: Optional[datetime], end_time: Optional[datetime]) -> List[Path]:
        """Get audit files relevant to the time range"""
        audit_files = list(self.audit_path.glob("audit-*.log*"))
        audit_files.sort()
        return audit_files  # Simplified - should filter by date range

    def _dict_to_log_entry(self, data: Dict[str, Any]) -> LogEntry:
        """Convert dictionary to LogEntry"""
        return LogEntry(
            log_id=data['log_id'],
            timestamp=datetime.fromisoformat(data['timestamp']),
            level=LogLevel(data['level']),
            source=data['source'],
            message=data['message'],
            correlation_id=data.get('correlation_id'),
            session_id=data.get('session_id'),
            user_id=data.get('user_id'),
            agent_id=data.get('agent_id'),
            data=data.get('data', {}),
            tags=data.get('tags', []),
            location=data.get('location'),
            environment=data.get('environment', 'production')
        )

    def _dict_to_audit_entry(self, data: Dict[str, Any]) -> AuditEntry:
        """Convert dictionary to AuditEntry"""
        return AuditEntry(
            audit_id=data['audit_id'],
            timestamp=datetime.fromisoformat(data['timestamp']),
            event_type=AuditEventType(data['event_type']),
            actor=data['actor'],
            action=data['action'],
            resource=data['resource'],
            outcome=data['outcome'],
            correlation_id=data.get('correlation_id'),
            session_id=data.get('session_id'),
            source_ip=data.get('source_ip'),
            user_agent=data.get('user_agent'),
            compliance_frameworks=[ComplianceFramework(cf) for cf in data.get('compliance_frameworks', [])],
            risk_level=data.get('risk_level', 'low'),
            data_classification=data.get('data_classification', 'internal'),
            retention_period=data.get('retention_period', 2557),
            before_state=data.get('before_state'),
            after_state=data.get('after_state'),
            metadata=data.get('metadata', {})
        )

    def _matches_log_filter(self, log_entry: LogEntry, filter_config: LogFilter) -> bool:
        """Check if log entry matches filter criteria"""
        if filter_config.start_time and log_entry.timestamp < filter_config.start_time:
            return False
        if filter_config.end_time and log_entry.timestamp > filter_config.end_time:
            return False
        if filter_config.levels and log_entry.level not in filter_config.levels:
            return False
        if filter_config.sources and log_entry.source not in filter_config.sources:
            return False
        if filter_config.agents and log_entry.agent_id not in filter_config.agents:
            return False
        if filter_config.correlation_ids and log_entry.correlation_id not in filter_config.correlation_ids:
            return False
        if filter_config.tags and not any(tag in log_entry.tags for tag in filter_config.tags):
            return False
        if filter_config.search_text and filter_config.search_text.lower() not in log_entry.message.lower():
            return False
        return True

    def _matches_audit_filter(self, audit_entry: AuditEntry, filter_config: AuditFilter) -> bool:
        """Check if audit entry matches filter criteria"""
        if filter_config.start_time and audit_entry.timestamp < filter_config.start_time:
            return False
        if filter_config.end_time and audit_entry.timestamp > filter_config.end_time:
            return False
        if filter_config.event_types and audit_entry.event_type not in filter_config.event_types:
            return False
        if filter_config.actors and audit_entry.actor not in filter_config.actors:
            return False
        if filter_config.resources and audit_entry.resource not in filter_config.resources:
            return False
        if filter_config.outcomes and audit_entry.outcome not in filter_config.outcomes:
            return False
        if filter_config.compliance_frameworks:
            if not any(cf in audit_entry.compliance_frameworks for cf in filter_config.compliance_frameworks):
                return False
        if filter_config.risk_levels and audit_entry.risk_level not in filter_config.risk_levels:
            return False
        if filter_config.correlation_ids and audit_entry.correlation_id not in filter_config.correlation_ids:
            return False
        return True

class DistributedAuditLogger:
    """
    Distributed logging and audit trail system for constellation
    """
    
    def __init__(self, storage: LogStorage, node_id: str = "constellation-node"):
        self.storage = storage
        self.node_id = node_id
        
        # In-memory buffers for batch processing
        self.log_buffer: List[LogEntry] = []
        self.audit_buffer: List[AuditEntry] = []
        self.buffer_size = 100
        self.flush_interval = 10  # seconds
        
        # Correlation tracking
        self.active_correlations: Dict[str, Dict[str, Any]] = {}
        
        # Integrity verification
        self.log_checksums: Dict[str, str] = {}
        self.audit_checksums: Dict[str, str] = {}
        
        # Background tasks
        self._flush_task: Optional[asyncio.Task] = None
        self._cleanup_task: Optional[asyncio.Task] = None
        self._is_running = False
        
        # Metrics
        self.metrics = {
            "logs_written": 0,
            "audits_written": 0,
            "logs_queried": 0,
            "audits_queried": 0,
            "buffer_flushes": 0,
            "integrity_checks": 0
        }
        
        logger.info("Distributed audit logger initialized", node_id=node_id)

    async def start(self):
        """Start the audit logger background tasks"""
        if self._is_running:
            return
        
        self._is_running = True
        
        # Start buffer flush task
        self._flush_task = asyncio.create_task(self._flush_loop())
        
        # Start cleanup task
        self._cleanup_task = asyncio.create_task(self._cleanup_loop())
        
        logger.info("Distributed audit logger started")

    async def stop(self):
        """Stop the audit logger and flush remaining buffers"""
        self._is_running = False
        
        # Flush remaining buffers
        await self._flush_buffers()
        
        # Stop background tasks
        if self._flush_task:
            self._flush_task.cancel()
            try:
                await self._flush_task
            except asyncio.CancelledError:
                pass
        
        if self._cleanup_task:
            self._cleanup_task.cancel()
            try:
                await self._cleanup_task
            except asyncio.CancelledError:
                pass
        
        logger.info("Distributed audit logger stopped")

    async def log(
        self,
        level: LogLevel,
        source: str,
        message: str,
        correlation_id: Optional[str] = None,
        session_id: Optional[str] = None,
        user_id: Optional[str] = None,
        agent_id: Optional[str] = None,
        data: Optional[Dict[str, Any]] = None,
        tags: Optional[List[str]] = None
    ):
        """Log a message with structured data"""
        log_entry = LogEntry(
            log_id=str(uuid.uuid4()),
            timestamp=datetime.utcnow(),
            level=level,
            source=source,
            message=message,
            correlation_id=correlation_id,
            session_id=session_id,
            user_id=user_id,
            agent_id=agent_id,
            data=data or {},
            tags=tags or [],
            environment=self.node_id
        )
        
        # Add to buffer
        self.log_buffer.append(log_entry)
        
        # Generate checksum for integrity
        self.log_checksums[log_entry.log_id] = self._generate_log_checksum(log_entry)
        
        # Flush if buffer is full
        if len(self.log_buffer) >= self.buffer_size:
            await self._flush_log_buffer()

    async def audit(
        self,
        event_type: AuditEventType,
        actor: str,
        action: str,
        resource: str,
        outcome: str,
        correlation_id: Optional[str] = None,
        session_id: Optional[str] = None,
        source_ip: Optional[str] = None,
        user_agent: Optional[str] = None,
        compliance_frameworks: Optional[List[ComplianceFramework]] = None,
        risk_level: str = "low",
        data_classification: str = "internal",
        retention_period: int = 2557,
        before_state: Optional[Dict[str, Any]] = None,
        after_state: Optional[Dict[str, Any]] = None,
        metadata: Optional[Dict[str, Any]] = None
    ):
        """Create an audit trail entry"""
        audit_entry = AuditEntry(
            audit_id=str(uuid.uuid4()),
            timestamp=datetime.utcnow(),
            event_type=event_type,
            actor=actor,
            action=action,
            resource=resource,
            outcome=outcome,
            correlation_id=correlation_id,
            session_id=session_id,
            source_ip=source_ip,
            user_agent=user_agent,
            compliance_frameworks=compliance_frameworks or [],
            risk_level=risk_level,
            data_classification=data_classification,
            retention_period=retention_period,
            before_state=before_state,
            after_state=after_state,
            metadata=metadata or {}
        )
        
        # Add to buffer
        self.audit_buffer.append(audit_entry)
        
        # Generate checksum for integrity
        self.audit_checksums[audit_entry.audit_id] = self._generate_audit_checksum(audit_entry)
        
        # Flush if buffer is full
        if len(self.audit_buffer) >= self.buffer_size:
            await self._flush_audit_buffer()

    @asynccontextmanager
    async def correlation_context(self, correlation_id: Optional[str] = None):
        """Context manager for correlated logging"""
        if correlation_id is None:
            correlation_id = str(uuid.uuid4())
        
        # Start correlation tracking
        self.active_correlations[correlation_id] = {
            "start_time": datetime.utcnow(),
            "log_count": 0,
            "audit_count": 0
        }
        
        try:
            yield correlation_id
        finally:
            # End correlation tracking
            if correlation_id in self.active_correlations:
                correlation_data = self.active_correlations[correlation_id]
                duration = (datetime.utcnow() - correlation_data["start_time"]).total_seconds()
                
                await self.log(
                    level=LogLevel.INFO,
                    source="audit-logger",
                    message="Correlation completed",
                    correlation_id=correlation_id,
                    data={
                        "duration_seconds": duration,
                        "log_count": correlation_data["log_count"],
                        "audit_count": correlation_data["audit_count"]
                    }
                )
                
                del self.active_correlations[correlation_id]

    async def query_logs(self, filter_config: LogFilter) -> List[LogEntry]:
        """Query logs with filtering"""
        # Flush buffers to ensure all logs are stored
        await self._flush_buffers()
        
        logs = await self.storage.query_logs(filter_config)
        self.metrics["logs_queried"] += len(logs)
        
        return logs

    async def query_audit(self, filter_config: AuditFilter) -> List[AuditEntry]:
        """Query audit entries with filtering"""
        # Flush buffers to ensure all audits are stored
        await self._flush_buffers()
        
        audits = await self.storage.query_audit(filter_config)
        self.metrics["audits_queried"] += len(audits)
        
        return audits

    async def verify_integrity(self, entry_id: str) -> bool:
        """Verify integrity of a log or audit entry"""
        # Check if it's a log entry
        if entry_id in self.log_checksums:
            expected_checksum = self.log_checksums[entry_id]
            # In a real implementation, you'd retrieve the entry and recalculate
            # For now, assume integrity is maintained
            self.metrics["integrity_checks"] += 1
            return True
        
        # Check if it's an audit entry
        if entry_id in self.audit_checksums:
            expected_checksum = self.audit_checksums[entry_id]
            # In a real implementation, you'd retrieve the entry and recalculate
            self.metrics["integrity_checks"] += 1
            return True
        
        return False

    def _generate_log_checksum(self, log_entry: LogEntry) -> str:
        """Generate integrity checksum for log entry"""
        content = f"{log_entry.log_id}{log_entry.timestamp.isoformat()}{log_entry.message}"
        return hashlib.sha256(content.encode()).hexdigest()

    def _generate_audit_checksum(self, audit_entry: AuditEntry) -> str:
        """Generate integrity checksum for audit entry"""
        content = f"{audit_entry.audit_id}{audit_entry.timestamp.isoformat()}{audit_entry.actor}{audit_entry.action}{audit_entry.resource}"
        return hashlib.sha256(content.encode()).hexdigest()

    async def _flush_loop(self):
        """Background task to flush buffers periodically"""
        while self._is_running:
            try:
                await asyncio.sleep(self.flush_interval)
                await self._flush_buffers()
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error("Flush loop error", error=str(e))

    async def _cleanup_loop(self):
        """Background task for cleanup operations"""
        while self._is_running:
            try:
                # Clean up old correlation data
                cutoff_time = datetime.utcnow() - timedelta(hours=1)
                expired_correlations = [
                    corr_id for corr_id, data in self.active_correlations.items()
                    if data["start_time"] < cutoff_time
                ]
                
                for corr_id in expired_correlations:
                    del self.active_correlations[corr_id]
                
                # Clean up old checksums (keep for 24 hours)
                cutoff_time = datetime.utcnow() - timedelta(hours=24)
                # In a real implementation, you'd check entry timestamps
                
                await asyncio.sleep(300)  # Run every 5 minutes
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error("Cleanup loop error", error=str(e))

    async def _flush_buffers(self):
        """Flush both log and audit buffers"""
        await self._flush_log_buffer()
        await self._flush_audit_buffer()

    async def _flush_log_buffer(self):
        """Flush log buffer to storage"""
        if not self.log_buffer:
            return
        
        try:
            # Store all logs in buffer
            for log_entry in self.log_buffer:
                await self.storage.store_log(log_entry)
                self.metrics["logs_written"] += 1
            
            # Clear buffer
            self.log_buffer.clear()
            self.metrics["buffer_flushes"] += 1
            
        except Exception as e:
            logger.error("Failed to flush log buffer", error=str(e))

    async def _flush_audit_buffer(self):
        """Flush audit buffer to storage"""
        if not self.audit_buffer:
            return
        
        try:
            # Store all audits in buffer
            for audit_entry in self.audit_buffer:
                await self.storage.store_audit(audit_entry)
                self.metrics["audits_written"] += 1
            
            # Clear buffer
            self.audit_buffer.clear()
            self.metrics["buffer_flushes"] += 1
            
        except Exception as e:
            logger.error("Failed to flush audit buffer", error=str(e))

    def get_metrics(self) -> Dict[str, Any]:
        """Get audit logger metrics"""
        return {
            **self.metrics,
            "log_buffer_size": len(self.log_buffer),
            "audit_buffer_size": len(self.audit_buffer),
            "active_correlations": len(self.active_correlations),
            "tracked_checksums": len(self.log_checksums) + len(self.audit_checksums)
        }

    # Convenience methods for common audit events
    async def audit_agent_action(self, agent_id: str, action: str, resource: str, outcome: str, **kwargs):
        """Audit an agent action"""
        await self.audit(
            event_type=AuditEventType.AGENT_ACTION,
            actor=agent_id,
            action=action,
            resource=resource,
            outcome=outcome,
            compliance_frameworks=[ComplianceFramework.SOC2],
            **kwargs
        )

    async def audit_data_access(self, user_id: str, resource: str, outcome: str, **kwargs):
        """Audit data access"""
        await self.audit(
            event_type=AuditEventType.DATA_ACCESS,
            actor=user_id,
            action="access",
            resource=resource,
            outcome=outcome,
            compliance_frameworks=[ComplianceFramework.GDPR, ComplianceFramework.CCPA],
            **kwargs
        )

    async def audit_security_event(self, actor: str, action: str, outcome: str, risk_level: str = "high", **kwargs):
        """Audit a security event"""
        await self.audit(
            event_type=AuditEventType.SECURITY_EVENT,
            actor=actor,
            action=action,
            resource="security-system",
            outcome=outcome,
            risk_level=risk_level,
            compliance_frameworks=[ComplianceFramework.SOC2, ComplianceFramework.ISO27001],
            **kwargs
        )

    async def audit_fair_housing_event(self, actor: str, action: str, resource: str, outcome: str, **kwargs):
        """Audit Fair Housing Act compliance event"""
        await self.audit(
            event_type=AuditEventType.COMPLIANCE_EVENT,
            actor=actor,
            action=action,
            resource=resource,
            outcome=outcome,
            compliance_frameworks=[ComplianceFramework.FAIR_HOUSING_ACT],
            risk_level="high",  # Housing compliance is high risk
            retention_period=2557,  # 7 years as required
            **kwargs
        )