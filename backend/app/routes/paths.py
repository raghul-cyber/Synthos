from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
import uuid

from ..database import get_db
from ..models.skill import UserSkill
from ..models.career_path import CareerPath
from ..services.path_generator import PathGeneratorService
from ..services.claude_service import ClaudeService

router = APIRouter(prefix="/api/paths", tags=["paths"])
path_svc = PathGeneratorService()
claude_svc = ClaudeService()


@router.get("/{user_id}")
async def get_career_paths(user_id: str,
                            db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(UserSkill).options(selectinload(UserSkill.skill)).where(
            UserSkill.user_id == uuid.UUID(user_id)
        )
    )
    user_skills = result.scalars().all()

    if not user_skills:
        return []

    return await path_svc.generate_paths(db, user_skills)


@router.get("/{user_id}/{path_id}")
async def get_path_detail(user_id: str, path_id: str,
                           db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(UserSkill).options(selectinload(UserSkill.skill)).where(
            UserSkill.user_id == uuid.UUID(user_id)
        )
    )
    user_skills = result.scalars().all()

    result = await db.execute(
        select(CareerPath).where(CareerPath.id == uuid.UUID(path_id))
    )
    path = result.scalar_one_or_none()
    if not path:
        return {"error": "Path not found"}

    path_data = path.to_dict()
    owned_names = set()
    for us in user_skills:
        if us.skill:
            owned_names.add(us.skill.name)

    required = path.required_skills or []
    skill_gap = [s for s in required if s not in owned_names]

    # Generate AI narrative
    narrative = await claude_svc.generate_path_narrative(
        user_skills, path_data, skill_gap
    )

    # Learning plan
    learning_plan = path_svc.generate_learning_plan(skill_gap)

    return {
        **path_data,
        "skills_have": [s for s in required if s in owned_names],
        "skills_need": skill_gap,
        "narrative": narrative,
        "learning_plan": learning_plan,
    }


@router.get("/{user_id}/{path_id}/plan")
async def get_learning_plan(user_id: str, path_id: str,
                              db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(UserSkill).options(selectinload(UserSkill.skill)).where(
            UserSkill.user_id == uuid.UUID(user_id)
        )
    )
    user_skills = result.scalars().all()
    owned_names = {us.skill.name for us in user_skills if us.skill}

    result = await db.execute(
        select(CareerPath).where(CareerPath.id == uuid.UUID(path_id))
    )
    path = result.scalar_one_or_none()
    if not path:
        return {"error": "Path not found"}

    required = path.required_skills or []
    skill_gap = [s for s in required if s not in owned_names]
    return path_svc.generate_learning_plan(skill_gap)
