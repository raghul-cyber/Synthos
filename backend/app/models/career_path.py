import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Numeric, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from ..database import Base


class CareerPath(Base):
    __tablename__ = "career_paths"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(String)
    avg_salary_min = Column(Integer)
    avg_salary_max = Column(Integer)
    demand_score = Column(Integer, default=50)
    growth_rate = Column(Numeric(5, 2), default=0)
    required_skills = Column(JSONB, default=[])
    nice_to_have_skills = Column(JSONB, default=[])
    created_at = Column(DateTime, default=datetime.utcnow)

    analyses = relationship("UserPathAnalysis", back_populates="career_path")

    def to_dict(self) -> dict:
        return {
            "id": str(self.id),
            "title": self.title,
            "description": self.description,
            "salary_min": self.avg_salary_min,
            "salary_max": self.avg_salary_max,
            "demand_score": self.demand_score,
            "growth_rate": float(self.growth_rate) if self.growth_rate else 0,
            "required_skills": self.required_skills or [],
            "nice_to_have_skills": self.nice_to_have_skills or [],
        }


class UserPathAnalysis(Base):
    __tablename__ = "user_path_analysis"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    path_id = Column(UUID(as_uuid=True), ForeignKey("career_paths.id", ondelete="CASCADE"))
    transition_probability = Column(Numeric(4, 3))
    time_to_transition_months = Column(Integer)
    roi_score = Column(Numeric(6, 2))
    skill_gap = Column(JSONB, default=[])
    ai_narrative = Column(String)
    generated_at = Column(DateTime, default=datetime.utcnow)

    career_path = relationship("CareerPath", back_populates="analyses")
