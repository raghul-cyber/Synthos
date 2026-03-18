import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from ..database import Base


class Skill(Base):
    __tablename__ = "skills"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), unique=True, nullable=False, index=True)
    category = Column(String(100), nullable=False, index=True)
    description = Column(String)
    market_demand_score = Column(Integer, default=50)
    demand_trend = Column(String(20), default="stable")
    yoy_change = Column(Numeric(5, 2), default=0)
    avg_salary_impact = Column(Integer, default=0)
    learning_hours = Column(Integer, default=100)
    created_at = Column(DateTime, default=datetime.utcnow)

    user_skills = relationship("UserSkill", back_populates="skill")
    adjacency_from = relationship("SkillAdjacency", foreign_keys="SkillAdjacency.skill_from", back_populates="source_skill")
    adjacency_to = relationship("SkillAdjacency", foreign_keys="SkillAdjacency.skill_to", back_populates="target_skill")

    def to_dict(self) -> dict:
        return {
            "id": str(self.id),
            "name": self.name,
            "category": self.category,
            "description": self.description,
            "market_demand_score": self.market_demand_score,
            "demand_trend": self.demand_trend,
            "yoy_change": float(self.yoy_change) if self.yoy_change else 0,
            "avg_salary_impact": self.avg_salary_impact,
            "learning_hours": self.learning_hours,
            "demand_label": self.demand_label,
            "obsolescence_risk": self.obsolescence_risk,
        }

    @property
    def demand_label(self) -> str:
        if self.market_demand_score >= 85:
            return "Critical"
        elif self.demand_trend == "growing":
            return "Growing"
        elif self.demand_trend == "declining":
            return "Declining"
        return "Stable"

    @property
    def obsolescence_risk(self) -> str:
        if self.demand_trend == "declining" and self.yoy_change and float(self.yoy_change) < -10:
            return "high"
        elif self.demand_trend == "declining":
            return "medium"
        elif self.market_demand_score < 55:
            return "low"
        return "none"


class SkillAdjacency(Base):
    __tablename__ = "skill_adjacency"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    skill_from = Column(UUID(as_uuid=True), ForeignKey("skills.id", ondelete="CASCADE"), index=True)
    skill_to = Column(UUID(as_uuid=True), ForeignKey("skills.id", ondelete="CASCADE"), index=True)
    adjacency_score = Column(Numeric(4, 3), nullable=False)
    co_occurrence_count = Column(Integer, default=0)

    source_skill = relationship("Skill", foreign_keys=[skill_from], back_populates="adjacency_from")
    target_skill = relationship("Skill", foreign_keys=[skill_to], back_populates="adjacency_to")


class UserSkill(Base):
    __tablename__ = "user_skills"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), index=True)
    skill_id = Column(UUID(as_uuid=True), ForeignKey("skills.id", ondelete="CASCADE"), index=True)
    proficiency = Column(String(20), default="beginner")
    validated = Column(Boolean, default=False)
    added_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="user_skills")
    skill = relationship("Skill", back_populates="user_skills")

    def to_dict(self) -> dict:
        return {
            "id": str(self.id),
            "skill_id": str(self.skill_id),
            "skill": self.skill.to_dict() if self.skill else None,
            "proficiency": self.proficiency,
            "validated": self.validated,
        }
