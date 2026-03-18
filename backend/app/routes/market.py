from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
import uuid

from ..database import get_db
from ..models.skill import Skill, UserSkill
from ..services.market_engine import MarketEngine

router = APIRouter(prefix="/api/market", tags=["market"])
engine = MarketEngine()


@router.get("/overlay/{user_id}")
async def get_market_overlay(user_id: str,
                              db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(UserSkill).options(selectinload(UserSkill.skill)).where(
            UserSkill.user_id == uuid.UUID(user_id)
        )
    )
    user_skills = result.scalars().all()

    if not user_skills:
        return {"demand": [], "portfolio": {}, "risks": [], "roi": [], "insight": ""}

    # Build demand data
    demand = []
    for us in user_skills:
        if us.skill:
            forecast = engine.get_demand_forecast(us.skill)
            demand.append({
                "skill": us.skill.name,
                "score": us.skill.market_demand_score,
                "trend": us.skill.demand_trend,
                "yoy_change": float(us.skill.yoy_change) if us.skill.yoy_change else 0,
                "forecast": forecast,
                "label": us.skill.demand_label,
            })

    demand.sort(key=lambda x: x["score"], reverse=True)

    # Portfolio scores
    portfolio = engine.calculate_portfolio_score(user_skills)

    # Obsolescence risks
    risks = await engine.get_obsolescence_risks(db, user_skills)

    # ROI opportunities
    skill_ids = [us.skill_id for us in user_skills if us.skill_id]
    roi = await engine.get_top_roi_skills(db, skill_ids, limit=3)

    return {
        "demand": demand,
        "portfolio": portfolio,
        "risks": risks,
        "roi": roi,
    }


@router.get("/trending")
async def get_trending(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Skill).where(Skill.demand_trend == "growing")
        .order_by(Skill.yoy_change.desc()).limit(20)
    )
    return [s.to_dict() for s in result.scalars().all()]


@router.get("/forecast/{skill_id}")
async def get_forecast(skill_id: str, months: int = 12,
                        db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Skill).where(Skill.id == uuid.UUID(skill_id)))
    skill = result.scalar_one_or_none()
    if not skill:
        return {"error": "Skill not found"}
    return engine.get_demand_forecast(skill, months)
