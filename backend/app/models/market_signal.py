import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Numeric, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from ..database import Base


class MarketSignal(Base):
    __tablename__ = "market_signals"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    skill_id = Column(UUID(as_uuid=True), ForeignKey("skills.id", ondelete="CASCADE"), index=True)
    signal_type = Column(String(50))
    signal_value = Column(Numeric(10, 2))
    source = Column(String(100))
    recorded_at = Column(DateTime, default=datetime.utcnow)
