from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..models.skill import Skill, UserSkill, SkillAdjacency


class MarketEngine:

    def get_demand_forecast(self, skill: Skill, months_ahead: int = 12) -> dict:
        current = skill.market_demand_score or 50
        yoy = float(skill.yoy_change) if skill.yoy_change else 0
        forecast = current * (1 + (yoy / 100) * (months_ahead / 12))
        forecast = max(0, min(100, forecast))
        confidence = max(0.5, 0.95 - (0.02 * months_ahead))
        return {
            "current_demand": current,
            "forecasted_demand": round(forecast, 1),
            "months_ahead": months_ahead,
            "confidence": round(confidence, 2),
            "trend": skill.demand_trend,
        }

    def calculate_portfolio_score(self, user_skills: list) -> dict:
        if not user_skills:
            return {"market_alignment": 0, "future_readiness": 0,
                    "skill_depth": 0, "synthos_score": 0}

        demand_scores = []
        forecasted_scores = []
        advanced_count = 0

        for us in user_skills:
            skill = us.skill if hasattr(us, 'skill') and us.skill else us
            demand = skill.market_demand_score or 50
            demand_scores.append(demand)
            forecast = self.get_demand_forecast(skill, 12)
            forecasted_scores.append(forecast["forecasted_demand"])
            if hasattr(us, 'proficiency') and us.proficiency == "advanced":
                advanced_count += 1

        market_alignment = round(sum(demand_scores) / len(demand_scores), 1)
        future_readiness = round(sum(forecasted_scores) / len(forecasted_scores), 1)
        skill_depth = round((advanced_count / len(user_skills)) * 100, 1) if user_skills else 0
        synthos_score = round(
            market_alignment * 0.4 + future_readiness * 0.4 + skill_depth * 0.2
        )

        return {
            "market_alignment": min(100, market_alignment),
            "future_readiness": min(100, future_readiness),
            "skill_depth": min(100, skill_depth),
            "synthos_score": min(100, synthos_score),
        }

    async def get_obsolescence_risks(self, session: AsyncSession,
                                      user_skills: list) -> list:
        risks = []
        for us in user_skills:
            skill = us.skill if hasattr(us, 'skill') and us.skill else us
            if skill.demand_trend == "declining" or (skill.market_demand_score or 50) < 55:
                # Find best pivot
                result = await session.execute(
                    select(SkillAdjacency, Skill).join(
                        Skill, SkillAdjacency.skill_to == Skill.id
                    ).where(
                        SkillAdjacency.skill_from == skill.id
                    ).order_by(Skill.market_demand_score.desc()).limit(1)
                )
                row = result.first()
                pivot = row[1].name if row else "Python"

                yoy = float(skill.yoy_change) if skill.yoy_change else 0
                risk_level = "high" if yoy < -10 else ("medium" if yoy < 0 else "low")
                risks.append({
                    "skill": skill.name,
                    "risk_level": risk_level,
                    "decline": f"{abs(yoy)}% demand decline over 12 months",
                    "pivot_skill": pivot,
                    "pivot_action": f"Pivot to {pivot}",
                    "current_demand": skill.market_demand_score,
                })

        return sorted(risks, key=lambda x: {"high": 0, "medium": 1, "low": 2}[x["risk_level"]])

    async def calculate_skill_roi(self, session: AsyncSession,
                                   skill: Skill, user_skill_ids: list) -> dict:
        # Find adjacency to owned skills
        result = await session.execute(
            select(SkillAdjacency).where(
                SkillAdjacency.skill_to == skill.id,
                SkillAdjacency.skill_from.in_(user_skill_ids)
            ).order_by(SkillAdjacency.adjacency_score.desc()).limit(1)
        )
        adj = result.scalar_one_or_none()
        adjacency_boost = float(adj.adjacency_score) if adj else 0.3

        base_value = skill.avg_salary_impact or 10000
        demand_multiplier = (skill.market_demand_score or 50) / 100
        learning_cost = (skill.learning_hours or 100) * 25  # $25/hour opportunity cost

        expected_value = base_value * demand_multiplier * (0.5 + adjacency_boost * 0.5)
        roi = ((expected_value - learning_cost) / max(learning_cost, 1)) * 100

        return {
            "skill": skill.to_dict(),
            "roi_score": round(roi, 1),
            "expected_value": round(expected_value),
            "learning_cost": learning_cost,
            "learning_hours": skill.learning_hours,
            "salary_impact": f"+${skill.avg_salary_impact:,}" if skill.avg_salary_impact else "+$0",
            "adjacency_boost": round(adjacency_boost, 2),
        }

    async def get_top_roi_skills(self, session: AsyncSession,
                                  user_skill_ids: list, limit: int = 5) -> list:
        owned_set = set(str(sid) for sid in user_skill_ids)
        # Get adjacent skills user doesn't have
        result = await session.execute(
            select(Skill).where(
                Skill.demand_trend != "declining",
                Skill.market_demand_score >= 60
            ).order_by(Skill.market_demand_score.desc()).limit(30)
        )
        candidates = [s for s in result.scalars().all() if str(s.id) not in owned_set]

        roi_list = []
        for skill in candidates[:15]:
            roi_data = await self.calculate_skill_roi(session, skill, user_skill_ids)
            roi_list.append(roi_data)

        return sorted(roi_list, key=lambda x: x["roi_score"], reverse=True)[:limit]
