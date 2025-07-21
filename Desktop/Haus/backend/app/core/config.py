"""
Configuration management for Cepheus Housing Constellation
"""

from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    """Application settings with environment variable support"""
    
    # Basic app settings
    APP_NAME: str = "Cepheus Housing Constellation"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Database settings (shared with Haus platform)
    DATABASE_URL: str = "postgresql+asyncpg://postgres:password@localhost:5432/haus_constellation"
    DATABASE_POOL_SIZE: int = 10
    DATABASE_MAX_OVERFLOW: int = 20
    
    # Haus platform integration
    HAUS_API_URL: str = "http://localhost:3001"
    HAUS_API_KEY: Optional[str] = None
    HAUS_TRPC_ENDPOINT: str = "http://localhost:3001/trpc"
    
    # Kafka configuration
    KAFKA_BOOTSTRAP_SERVERS: List[str] = ["localhost:9092"]
    KAFKA_TOPIC_PREFIX: str = "haus-constellation"
    
    # Redis configuration
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_CACHE_TTL: int = 3600  # 1 hour
    
    # Security settings
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS settings
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:3001"]
    ALLOWED_HOSTS: List[str] = ["localhost", "127.0.0.1"]
    
    # Constellation agent settings
    MAX_CONCURRENT_AGENTS: int = 10
    AGENT_HEARTBEAT_INTERVAL: int = 30  # seconds
    AGENT_TIMEOUT: int = 300  # 5 minutes
    
    # MPC settings
    MPC_KEY_SIZE: int = 2048
    MPC_THRESHOLD: int = 3  # Minimum participants for computation
    
    # External services
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    
    # Monitoring
    PROMETHEUS_PORT: int = 8001
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Global settings instance
_settings: Optional[Settings] = None

def get_settings() -> Settings:
    """Get application settings (singleton pattern)"""
    global _settings
    if _settings is None:
        _settings = Settings()
    return _settings