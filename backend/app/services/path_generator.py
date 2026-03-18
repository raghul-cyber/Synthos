from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..models.skill import Skill, SkillAdjacency
from ..models.career_path import CareerPath


class PathGeneratorService:

    async def generate_paths(self, session: AsyncSession,
                              user_skills: list, limit: int = 5) -> list:
        owned_names = set()
        for us in user_skills:
            skill = us.skill if hasattr(us, 'skill') and us.skill else us
            owned_names.add(skill.name)

        result = await session.execute(select(CareerPath))
        all_paths = result.scalars().all()

        analyses = []
        for path in all_paths:
            required = path.required_skills or []
            nice = path.nice_to_have_skills or []
            have = [s for s in required if s in owned_names]
            need = [s for s in required if s not in owned_names]
            nice_have = [s for s in nice if s in owned_names]

            prob = self._calculate_transition_probability(
                owned_names, required, nice
            )
            progress = round(len(have) / max(len(required), 1) * 100)
            time_months = max(1, len(need) * 2)  # ~2 months per missing skill

            # ROI calculation
            salary_mid = ((path.avg_salary_max or 0) + (path.avg_salary_min or 0)) / 2
            learning_cost = len(need) * 150 * 25  # avg 150 hours * $25
            salary_gain = salary_mid * 0.15  # assume 15% raise
            roi = round(((prob * salary_gain - learning_cost) / max(learning_cost, 1)) * 100)

            badge = "Recommended" if prob >= 0.75 else ("High Growth" if (path.growth_rate or 0) > 30 else "Safe Pivot")
            badge_class = "" if badge == "Recommended" else ("growth" if badge == "High Growth" else "safe")

            analyses.append({
                **path.to_dict(),
                "badge": badge,
                "badge_class": badge_class,
                "skills_have": have,
                "skills_need": need,
                "nice_to_have_owned": nice_have,
                "transition_probability": round(prob * 100),
                "time_to_transition": f"{time_months} months",
                "time_months": time_months,
                "progress": progress,
                "roi": max(0, roi),
            })

        analyses.sort(key=lambda x: x["roi"], reverse=True)
        return analyses[:limit]

    def _calculate_transition_probability(self, owned_names: set,
                                           required: list, nice: list) -> float:
        if not required:
            return 0.5
        owned_count = sum(1 for s in required if s in owned_names)
        nice_count = sum(1 for s in nice if s in owned_names)
        base = owned_count / len(required)
        nice_bonus = (nice_count / max(len(nice), 1)) * 0.15
        return min(0.97, base * 0.7 + nice_bonus + 0.15)

    def generate_learning_plan(self, skill_gap: list, weeks: int = 8) -> list:
        plan = []
        hours_per_week = 40
        skills_per_block = max(1, len(skill_gap) // (weeks // 2))

        for i in range(0, len(skill_gap), skills_per_block):
            block = skill_gap[i:i + skills_per_block]
            week_start = (i // skills_per_block) * 2 + 1
            week_end = week_start + 1
            plan.append({
                "title": f"Week {week_start}-{week_end}",
                "skills": block,
                "description": f"Focus on {', '.join(block)}. Dedicate {hours_per_week} hours to hands-on projects and structured learning.",
                "milestones": [f"Complete foundational course for {s}" for s in block] +
                              [f"Build a mini-project using {block[0]}"] if block else [],
            })

        return plan
