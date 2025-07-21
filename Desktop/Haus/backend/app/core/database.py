"""
Database configuration and connection management
Integrates with existing Haus platform database
"""

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import MetaData
import structlog

from app.core.config import get_settings

logger = structlog.get_logger(__name__)

class Base(DeclarativeBase):
    """Base class for all database models"""
    metadata = MetaData(
        naming_convention={
            "ix": "ix_%(column_0_label)s",
            "uq": "uq_%(table_name)s_%(column_0_name)s",
            "ck": "ck_%(table_name)s_%(constraint_name)s",
            "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
            "pk": "pk_%(table_name)s"
        }
    )

# Global database instances
engine = None
AsyncSessionLocal = None

async def init_db():
    """Initialize database connection"""
    global engine, AsyncSessionLocal
    
    settings = get_settings()
    
    try:
        # For development, use SQLite if PostgreSQL is not available
        database_url = getattr(settings, 'DATABASE_URL', None)
        if not database_url or "postgresql" in str(database_url):
            # Use SQLite for development
            database_url = "sqlite+aiosqlite:///./cepheus_constellation.db"
            logger.info("🗂️ Using SQLite database for development")
        
        # Create async engine
        engine = create_async_engine(
            database_url,
            pool_size=getattr(settings, 'DATABASE_POOL_SIZE', 20) if "postgresql" in str(database_url) else None,
            max_overflow=getattr(settings, 'DATABASE_MAX_OVERFLOW', 30) if "postgresql" in str(database_url) else None,
            echo=getattr(settings, 'DEBUG', False),
            future=True
        )
        
        # Create session factory
        AsyncSessionLocal = async_sessionmaker(
            engine,
            class_=AsyncSession,
            expire_on_commit=False
        )
        
        # Test connection
        async with engine.begin() as conn:
            await conn.run_sync(lambda _: None)  # Simple connection test
            
        logger.info("✅ Database connection established", url=database_url)
        
    except Exception as e:
        logger.warning("⚠️ Database initialization failed, continuing without database", error=str(e))
        AsyncSessionLocal = None

async def close_db():
    """Close database connections"""
    global engine
    
    if engine:
        await engine.dispose()
        logger.info("✅ Database connections closed")

async def get_db() -> AsyncSession:
    """Dependency to get database session"""
    if not AsyncSessionLocal:
        raise RuntimeError("Database not initialized")
        
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

async def get_database() -> AsyncSession:
    """Get database session for constellation manager"""
    if not AsyncSessionLocal:
        await init_db()
    
    if AsyncSessionLocal:
        async with AsyncSessionLocal() as session:
            try:
                return session
            except Exception:
                await session.rollback()
                raise
    else:
        return None

async def create_tables():
    """Create all tables (for development/testing)"""
    if not engine:
        raise RuntimeError("Database engine not initialized")
        
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    logger.info("✅ Database tables created")