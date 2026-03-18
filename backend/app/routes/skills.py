from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from pydantic import BaseModel
import uuid

from ..database import get_db
from ..models.skill import Skill, UserSkill
from ..models.user import User
from ..services.ontology_service import OntologyService

router = APIRouter(prefix="/api/skills", tags=["skills"])
ontology = OntologyService()


class AddUserSkillRequest(BaseModel):
    user_id: str
    skill_id: str
    proficiency: str = "intermediate"


@router.get("/search")
async def search_skills(q: str = "", db: AsyncSession = Depends(get_db)):
    if not q or len(q) < 1:
        return []
    return await ontology.search_skills(db, q)


@router.get("/ontology")
async def get_skill_ontology(db: AsyncSession = Depends(get_db)):
    return await ontology.get_full_ontology(db)


@router.get("/ontology/static")
async def get_static_ontology():
    return ontology.get_static_ontology()


@router.get("/by-name/{name}")
async def get_skill_by_name(name: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Skill).where(Skill.name == name))
    skill = result.scalar_one_or_none()
    if not skill:
        raise HTTPException(status_code=404, detail=f"Skill '{name}' not found")
    return skill.to_dict()


@router.post("/user")
async def add_user_skill(req: AddUserSkillRequest,
                          db: AsyncSession = Depends(get_db)):
    # Verify user exists
    result = await db.execute(select(User).where(User.id == uuid.UUID(req.user_id)))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Verify skill exists
    result = await db.execute(select(Skill).where(Skill.id == uuid.UUID(req.skill_id)))
    skill = result.scalar_one_or_none()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    # Check if already added
    result = await db.execute(
        select(UserSkill).where(
            UserSkill.user_id == uuid.UUID(req.user_id),
            UserSkill.skill_id == uuid.UUID(req.skill_id)
        )
    )
    existing = result.scalar_one_or_none()
    if existing:
        existing.proficiency = req.proficiency
        await db.commit()
        return {"message": "Skill proficiency updated"}

    us = UserSkill(
        user_id=uuid.UUID(req.user_id),
        skill_id=uuid.UUID(req.skill_id),
        proficiency=req.proficiency,
    )
    db.add(us)
    await db.commit()
    return {"message": "Skill added successfully"}


@router.delete("/user/{user_id}/{skill_id}")
async def remove_user_skill(user_id: str, skill_id: str,
                              db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(UserSkill).where(
            UserSkill.user_id == uuid.UUID(user_id),
            UserSkill.skill_id == uuid.UUID(skill_id)
        )
    )
    us = result.scalar_one_or_none()
    if us:
        await db.delete(us)
        await db.commit()
    return {"message": "Skill removed"}


@router.get("/user/{user_id}")
async def get_user_skills(user_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(UserSkill).options(selectinload(UserSkill.skill)).where(
            UserSkill.user_id == uuid.UUID(user_id)
        )
    )
    user_skills = result.scalars().all()
    return [us.to_dict() for us in user_skills]


@router.get("/adjacency/{skill_id}")
async def get_skill_adjacency(skill_id: str,
                                db: AsyncSession = Depends(get_db)):
    from ..services.skill_graph import SkillGraphService
    graph_svc = SkillGraphService()
    return await graph_svc.get_adjacent_skills(db, [uuid.UUID(skill_id)])
