from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from pydantic import BaseModel
import uuid

from ..database import get_db
from ..models.skill import UserSkill
from ..services.skill_graph import SkillGraphService
from ..services.claude_service import ClaudeService
from ..services.market_engine import MarketEngine

router = APIRouter(prefix="/api/intelligence", tags=["intelligence"])
graph_svc = SkillGraphService()
claude_svc = ClaudeService()
market_engine = MarketEngine()


class GraphRequest(BaseModel):
    skill_ids: list[str]


class InsightRequest(BaseModel):
    user_id: str


@router.post("/graph")
async def build_graph(req: GraphRequest,
                       db: AsyncSession = Depends(get_db)):
    skill_uuids = [uuid.UUID(sid) for sid in req.skill_ids]
    graph_data = await graph_svc.get_graph_data_for_viz(db, skill_uuids)
    return graph_data


@router.post("/insight")
async def get_insight(req: InsightRequest,
                       db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(UserSkill).options(selectinload(UserSkill.skill)).where(
            UserSkill.user_id == uuid.UUID(req.user_id)
        )
    )
    user_skills = result.scalars().all()

    if not user_skills:
        return {"insight": "Add skills to get personalized insights."}

    portfolio = market_engine.calculate_portfolio_score(user_skills)
    insight = await claude_svc.generate_portfolio_insight(user_skills, portfolio)

    return {"insight": insight, "portfolio": portfolio}


@router.get("/adjacent/{user_id}")
async def get_adjacent(user_id: str,
                        db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(UserSkill).where(UserSkill.user_id == uuid.UUID(user_id))
    )
    user_skills = result.scalars().all()
    skill_ids = [us.skill_id for us in user_skills]
    return await graph_svc.get_adjacent_skills(db, skill_ids)
