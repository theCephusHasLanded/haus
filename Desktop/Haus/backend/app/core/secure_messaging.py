"""
Secure Agent-to-Agent Messaging Framework
Week 3 Enhancement: Advanced communication protocols with encryption and authentication
"""

import asyncio
import json
import time
import hashlib
import hmac
from typing import Dict, List, Optional, Any, Union
from datetime import datetime, timedelta
from dataclasses import dataclass, field
from enum import Enum
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import serialization
import base64
import structlog
import uuid

logger = structlog.get_logger(__name__)

class MessageType(str, Enum):
    """Types of inter-agent messages"""
    TASK_REQUEST = "task_request"
    TASK_RESPONSE = "task_response" 
    STATUS_UPDATE = "status_update"
    HEARTBEAT = "heartbeat"
    COORDINATION = "coordination"
    ALERT = "alert"
    WORKFLOW_EVENT = "workflow_event"
    SYSTEM_COMMAND = "system_command"

class MessagePriority(int, Enum):
    """Message priority levels"""
    CRITICAL = 1
    HIGH = 2
    NORMAL = 3
    LOW = 4
    BACKGROUND = 5

class SecurityLevel(str, Enum):
    """Security levels for messages"""
    PUBLIC = "public"           # No encryption, basic auth
    INTERNAL = "internal"       # Symmetric encryption
    CONFIDENTIAL = "confidential"  # Asymmetric encryption
    TOP_SECRET = "top_secret"   # Full encryption + digital signatures

@dataclass
class MessageHeaders:
    """Message metadata and routing information"""
    message_id: str
    message_type: MessageType
    priority: MessagePriority
    security_level: SecurityLevel
    sender_id: str
    recipient_id: str
    correlation_id: Optional[str] = None
    reply_to: Optional[str] = None
    timestamp: datetime = field(default_factory=datetime.utcnow)
    ttl_seconds: int = 300  # Time to live
    requires_ack: bool = True
    retry_count: int = 0
    max_retries: int = 3

@dataclass
class SecureMessage:
    """Encrypted and authenticated inter-agent message"""
    headers: MessageHeaders
    payload: Dict[str, Any]
    encrypted_payload: Optional[str] = None
    signature: Optional[str] = None
    auth_token: Optional[str] = None
    checksum: Optional[str] = None

@dataclass
class MessageRoute:
    """Message routing configuration"""
    sender: str
    recipient: str
    message_type: MessageType
    encryption_required: bool
    authentication_required: bool
    delivery_guarantees: str  # "at_most_once", "at_least_once", "exactly_once"

class SecureMessagingProtocol:
    """
    Secure messaging protocol for agent-to-agent communication
    Supports multiple encryption modes and authentication mechanisms
    """
    
    def __init__(self, agent_id: str, constellation_key: str):
        self.agent_id = agent_id
        self.constellation_key = constellation_key
        
        # Generate agent-specific encryption keys
        self._symmetric_key = self._generate_symmetric_key()
        self._asymmetric_keys = self._generate_asymmetric_keys()
        
        # Message tracking
        self.sent_messages: Dict[str, SecureMessage] = {}
        self.pending_acks: Dict[str, datetime] = {}
        self.routing_table: Dict[str, MessageRoute] = {}
        
        # Security policies
        self.trusted_agents: Set[str] = set()
        self.message_filters: List[callable] = []
        
        logger.info("Secure messaging protocol initialized", agent_id=agent_id)

    def _generate_symmetric_key(self) -> Fernet:
        """Generate symmetric encryption key from constellation key"""
        password = self.constellation_key.encode()
        salt = f"constellation-{self.agent_id}".encode()
        
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        key = base64.urlsafe_b64encode(kdf.derive(password))
        return Fernet(key)

    def _generate_asymmetric_keys(self) -> Dict[str, Any]:
        """Generate RSA key pair for asymmetric encryption"""
        private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048,
        )
        public_key = private_key.public_key()
        
        return {
            'private': private_key,
            'public': public_key,
            'private_pem': private_key.private_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PrivateFormat.PKCS8,
                encryption_algorithm=serialization.NoEncryption()
            ),
            'public_pem': public_key.public_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PublicFormat.SubjectPublicKeyInfo
            )
        }

    async def send_message(
        self,
        recipient_id: str,
        message_type: MessageType,
        payload: Dict[str, Any],
        priority: MessagePriority = MessagePriority.NORMAL,
        security_level: SecurityLevel = SecurityLevel.INTERNAL,
        correlation_id: Optional[str] = None
    ) -> str:
        """
        Send secure message to another agent
        Returns message ID for tracking
        """
        # Create message headers
        message_id = str(uuid.uuid4())
        headers = MessageHeaders(
            message_id=message_id,
            message_type=message_type,
            priority=priority,
            security_level=security_level,
            sender_id=self.agent_id,
            recipient_id=recipient_id,
            correlation_id=correlation_id
        )
        
        # Create and secure the message
        message = SecureMessage(headers=headers, payload=payload)
        secured_message = await self._secure_message(message)
        
        # Store for tracking
        self.sent_messages[message_id] = secured_message
        if headers.requires_ack:
            self.pending_acks[message_id] = datetime.utcnow()
        
        # Route message through constellation
        await self._route_message(secured_message)
        
        logger.info(
            "Secure message sent",
            message_id=message_id,
            recipient=recipient_id,
            message_type=message_type.value,
            security_level=security_level.value
        )
        
        return message_id

    async def _secure_message(self, message: SecureMessage) -> SecureMessage:
        """Apply security measures based on security level"""
        
        if message.headers.security_level == SecurityLevel.PUBLIC:
            # Basic authentication only
            message.auth_token = self._generate_auth_token(message)
            
        elif message.headers.security_level == SecurityLevel.INTERNAL:
            # Symmetric encryption
            payload_json = json.dumps(message.payload)
            message.encrypted_payload = self._symmetric_key.encrypt(
                payload_json.encode()
            ).decode()
            message.auth_token = self._generate_auth_token(message)
            
        elif message.headers.security_level == SecurityLevel.CONFIDENTIAL:
            # Asymmetric encryption (requires recipient public key)
            recipient_public_key = await self._get_agent_public_key(
                message.headers.recipient_id
            )
            if recipient_public_key:
                payload_json = json.dumps(message.payload)
                encrypted = recipient_public_key.encrypt(
                    payload_json.encode(),
                    padding.OAEP(
                        mgf=padding.MGF1(algorithm=hashes.SHA256()),
                        algorithm=hashes.SHA256(),
                        label=None
                    )
                )
                message.encrypted_payload = base64.b64encode(encrypted).decode()
            message.auth_token = self._generate_auth_token(message)
            
        elif message.headers.security_level == SecurityLevel.TOP_SECRET:
            # Full encryption + digital signature
            await self._secure_message_top_secret(message)
        
        # Generate checksum for integrity
        message.checksum = self._generate_checksum(message)
        
        return message

    async def _secure_message_top_secret(self, message: SecureMessage):
        """Apply top secret security measures"""
        # Double encryption: symmetric + asymmetric
        payload_json = json.dumps(message.payload)
        
        # First: symmetric encryption
        symmetric_encrypted = self._symmetric_key.encrypt(payload_json.encode())
        
        # Second: asymmetric encryption of the symmetric result
        recipient_public_key = await self._get_agent_public_key(
            message.headers.recipient_id
        )
        if recipient_public_key:
            asymmetric_encrypted = recipient_public_key.encrypt(
                symmetric_encrypted,
                padding.OAEP(
                    mgf=padding.MGF1(algorithm=hashes.SHA256()),
                    algorithm=hashes.SHA256(),
                    label=None
                )
            )
            message.encrypted_payload = base64.b64encode(asymmetric_encrypted).decode()
        
        # Digital signature
        message_content = f"{message.headers.message_id}{message.headers.timestamp}{message.encrypted_payload}"
        signature = self._asymmetric_keys['private'].sign(
            message_content.encode(),
            padding.PSS(
                mgf=padding.MGF1(hashes.SHA256()),
                salt_length=padding.PSS.MAX_LENGTH,
            ),
            hashes.SHA256()
        )
        message.signature = base64.b64encode(signature).decode()
        
        # Enhanced authentication
        message.auth_token = self._generate_enhanced_auth_token(message)

    def _generate_auth_token(self, message: SecureMessage) -> str:
        """Generate HMAC-based authentication token"""
        content = f"{message.headers.sender_id}{message.headers.recipient_id}{message.headers.timestamp}"
        return hmac.new(
            self.constellation_key.encode(),
            content.encode(),
            hashlib.sha256
        ).hexdigest()

    def _generate_enhanced_auth_token(self, message: SecureMessage) -> str:
        """Generate enhanced authentication for top secret messages"""
        content = f"{message.headers.message_id}{message.headers.sender_id}{message.headers.recipient_id}{message.headers.timestamp}{message.encrypted_payload}"
        return hmac.new(
            self.constellation_key.encode(),
            content.encode(),
            hashlib.sha512
        ).hexdigest()

    def _generate_checksum(self, message: SecureMessage) -> str:
        """Generate message integrity checksum"""
        content = f"{message.headers.message_id}{message.headers.timestamp}"
        if message.encrypted_payload:
            content += message.encrypted_payload
        else:
            content += json.dumps(message.payload)
        
        return hashlib.sha256(content.encode()).hexdigest()

    async def _get_agent_public_key(self, agent_id: str) -> Optional[Any]:
        """Get public key for another agent (from constellation registry)"""
        # This would typically fetch from the constellation registry
        # For now, return None to indicate key not available
        logger.warning("Public key retrieval not implemented", agent_id=agent_id)
        return None

    async def _route_message(self, message: SecureMessage):
        """Route message through constellation"""
        # This would integrate with the constellation's message routing
        logger.info("Message routed through constellation", 
                   message_id=message.headers.message_id)

    async def receive_message(self, raw_message: Dict[str, Any]) -> Optional[SecureMessage]:
        """
        Receive and decrypt incoming message
        Returns None if message fails security checks
        """
        try:
            # Parse message
            message = self._parse_raw_message(raw_message)
            
            # Verify message integrity and authenticity
            if not await self._verify_message(message):
                logger.warning("Message failed security verification",
                              message_id=message.headers.message_id)
                return None
            
            # Decrypt payload based on security level
            await self._decrypt_message(message)
            
            # Send acknowledgment if required
            if message.headers.requires_ack:
                await self._send_acknowledgment(message)
            
            logger.info("Secure message received and processed",
                       message_id=message.headers.message_id,
                       sender=message.headers.sender_id)
            
            return message
            
        except Exception as e:
            logger.error("Failed to process incoming message", error=str(e))
            return None

    def _parse_raw_message(self, raw_message: Dict[str, Any]) -> SecureMessage:
        """Parse raw message into SecureMessage object"""
        headers_data = raw_message['headers']
        headers = MessageHeaders(
            message_id=headers_data['message_id'],
            message_type=MessageType(headers_data['message_type']),
            priority=MessagePriority(headers_data['priority']),
            security_level=SecurityLevel(headers_data['security_level']),
            sender_id=headers_data['sender_id'],
            recipient_id=headers_data['recipient_id'],
            correlation_id=headers_data.get('correlation_id'),
            timestamp=datetime.fromisoformat(headers_data['timestamp']),
            ttl_seconds=headers_data.get('ttl_seconds', 300),
            requires_ack=headers_data.get('requires_ack', True)
        )
        
        return SecureMessage(
            headers=headers,
            payload=raw_message.get('payload', {}),
            encrypted_payload=raw_message.get('encrypted_payload'),
            signature=raw_message.get('signature'),
            auth_token=raw_message.get('auth_token'),
            checksum=raw_message.get('checksum')
        )

    async def _verify_message(self, message: SecureMessage) -> bool:
        """Verify message authenticity and integrity"""
        # Check TTL
        if datetime.utcnow() > message.headers.timestamp + timedelta(seconds=message.headers.ttl_seconds):
            logger.warning("Message expired", message_id=message.headers.message_id)
            return False
        
        # Verify checksum
        expected_checksum = self._generate_checksum(message)
        if message.checksum != expected_checksum:
            logger.warning("Message checksum mismatch", message_id=message.headers.message_id)
            return False
        
        # Verify authentication token
        if not self._verify_auth_token(message):
            logger.warning("Authentication failed", message_id=message.headers.message_id)
            return False
        
        # Verify digital signature for top secret messages
        if message.headers.security_level == SecurityLevel.TOP_SECRET and message.signature:
            if not await self._verify_digital_signature(message):
                logger.warning("Digital signature verification failed", 
                              message_id=message.headers.message_id)
                return False
        
        return True

    def _verify_auth_token(self, message: SecureMessage) -> bool:
        """Verify HMAC authentication token"""
        if message.headers.security_level == SecurityLevel.TOP_SECRET:
            expected_token = self._generate_enhanced_auth_token(message)
        else:
            expected_token = self._generate_auth_token(message)
        
        return hmac.compare_digest(message.auth_token or "", expected_token)

    async def _verify_digital_signature(self, message: SecureMessage) -> bool:
        """Verify digital signature for top secret messages"""
        # Would need sender's public key to verify
        # For now, return True as placeholder
        return True

    async def _decrypt_message(self, message: SecureMessage):
        """Decrypt message payload based on security level"""
        if not message.encrypted_payload:
            return  # No encryption applied
        
        try:
            if message.headers.security_level == SecurityLevel.INTERNAL:
                # Symmetric decryption
                decrypted = self._symmetric_key.decrypt(
                    message.encrypted_payload.encode()
                )
                message.payload = json.loads(decrypted.decode())
                
            elif message.headers.security_level == SecurityLevel.CONFIDENTIAL:
                # Asymmetric decryption
                encrypted_data = base64.b64decode(message.encrypted_payload)
                decrypted = self._asymmetric_keys['private'].decrypt(
                    encrypted_data,
                    padding.OAEP(
                        mgf=padding.MGF1(algorithm=hashes.SHA256()),
                        algorithm=hashes.SHA256(),
                        label=None
                    )
                )
                message.payload = json.loads(decrypted.decode())
                
            elif message.headers.security_level == SecurityLevel.TOP_SECRET:
                # Double decryption
                encrypted_data = base64.b64decode(message.encrypted_payload)
                
                # First: asymmetric decryption
                asymmetric_decrypted = self._asymmetric_keys['private'].decrypt(
                    encrypted_data,
                    padding.OAEP(
                        mgf=padding.MGF1(algorithm=hashes.SHA256()),
                        algorithm=hashes.SHA256(),
                        label=None
                    )
                )
                
                # Second: symmetric decryption
                symmetric_decrypted = self._symmetric_key.decrypt(asymmetric_decrypted)
                message.payload = json.loads(symmetric_decrypted.decode())
                
        except Exception as e:
            logger.error("Failed to decrypt message", 
                        message_id=message.headers.message_id, 
                        error=str(e))
            raise

    async def _send_acknowledgment(self, received_message: SecureMessage):
        """Send acknowledgment for received message"""
        ack_payload = {
            "ack_for": received_message.headers.message_id,
            "status": "received",
            "timestamp": datetime.utcnow().isoformat()
        }
        
        await self.send_message(
            recipient_id=received_message.headers.sender_id,
            message_type=MessageType.STATUS_UPDATE,
            payload=ack_payload,
            priority=MessagePriority.HIGH,
            security_level=SecurityLevel.INTERNAL,
            correlation_id=received_message.headers.message_id
        )

    async def cleanup_expired_messages(self):
        """Clean up expired messages and pending acknowledgments"""
        current_time = datetime.utcnow()
        
        # Clean up expired acknowledgments
        expired_acks = [
            msg_id for msg_id, timestamp in self.pending_acks.items()
            if current_time > timestamp + timedelta(minutes=5)
        ]
        
        for msg_id in expired_acks:
            del self.pending_acks[msg_id]
            logger.warning("Message acknowledgment timeout", message_id=msg_id)
        
        # Clean up old sent messages
        expired_messages = [
            msg_id for msg_id, message in self.sent_messages.items()
            if current_time > message.headers.timestamp + timedelta(hours=1)
        ]
        
        for msg_id in expired_messages:
            del self.sent_messages[msg_id]

    def get_messaging_stats(self) -> Dict[str, Any]:
        """Get messaging statistics"""
        return {
            "sent_messages": len(self.sent_messages),
            "pending_acknowledgments": len(self.pending_acks),
            "trusted_agents": len(self.trusted_agents),
            "routing_rules": len(self.routing_table)
        }