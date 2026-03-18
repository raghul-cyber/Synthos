from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from datetime import datetime
import uuid

from ..database import get_db
from ..models.user import User

router = APIRouter(prefix="/api/auth", tags=["auth"])


class RegisterRequest(BaseModel):
    email: str
    name: str | None = None
    industry: str | None = None
    years_experience: int = 0


class LoginRequest(BaseModel):
    email: str


@router.post("/register")
async def register(req: RegisterRequest, db: AsyncSession = Depends(get_db)):
    # Check for existing user
    result = await db.execute(select(User).where(User.email == req.email))
    existing = result.scalar_one_or_none()
    if existing:
        return existing.to_dict()

    user = User(
        id=uuid.uuid4(),
        email=req.email,
        name=req.name,
        industry=req.industry,
        years_experience=req.years_experience,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user.to_dict()


@router.post("/login")
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == req.email))
    user = result.scalar_one_or_none()
    if not user:
        # Auto-create for demo purposes
        user = User(id=uuid.uuid4(), email=req.email)
        db.add(user)
        await db.commit()
        await db.refresh(user)
    return user.to_dict()


@router.get("/me/{user_id}")
async def get_me(user_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == uuid.UUID(user_id)))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.to_dict()
