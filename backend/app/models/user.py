import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from ..database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False)
    name = Column(String(255))
    industry = Column(String(100))
    years_experience = Column(Integer, default=0)
    location = Column(String(100))
    synthos_score = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user_skills = relationship("UserSkill", back_populates="user", cascade="all, delete-orphan")

    def to_dict(self) -> dict:
        return {
            "id": str(self.id),
            "email": self.email,
            "name": self.name,
            "industry": self.industry,
            "years_experience": self.years_experience,
            "location": self.location,
            "synthos_score": self.synthos_score,
            "skill_count": len(self.user_skills) if self.user_skills else 0,
        }

    def calculate_synthos_score(self) -> int:
        if not self.user_skills:
            return 0
        demand_scores = []
        advanced_count = 0
        categories = set()
        for us in self.user_skills:
            if us.skill:
                demand_scores.append(us.skill.market_demand_score or 50)
                categories.add(us.skill.category)
                if us.proficiency == "advanced":
                    advanced_count += 1
        if not demand_scores:
            return 0
        base = sum(demand_scores) / len(demand_scores)
        depth_bonus = advanced_count * 5
        diversity_bonus = len(categories) * 3
        return min(100, int(base * 0.7 + depth_bonus + diversity_bonus))
