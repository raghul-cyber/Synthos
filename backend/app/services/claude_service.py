import httpx
from ..config import get_settings

settings = get_settings()


class ClaudeService:

    def __init__(self):
        self.api_key = settings.ANTHROPIC_API_KEY
        self.model = "claude-sonnet-4-20250514"

    async def _call(self, prompt: str, max_tokens: int = 500) -> str | None:
        if not self.api_key:
            return None
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    "https://api.anthropic.com/v1/messages",
                    headers={
                        "x-api-key": self.api_key,
                        "anthropic-version": "2023-06-01",
                        "content-type": "application/json",
                    },
                    json={
                        "model": self.model,
                        "max_tokens": max_tokens,
                        "temperature": 0.7,
                        "messages": [{"role": "user", "content": prompt}],
                    },
                )
                data = response.json()
                return data.get("content", [{}])[0].get("text")
        except Exception:
            return None

    async def generate_path_narrative(self, user_skills: list,
                                      target_path: dict,
                                      skill_gap: list) -> str:
        skill_names = [s.skill.name if hasattr(s, 'skill') and s.skill else s.name
                       for s in user_skills]
        prompt = f"""You are Synthos, a career intelligence system with deep knowledge of labor markets and skill development.

User's current skills: {skill_names}
Target career path: {target_path['title']}
Skills they need to acquire: {skill_gap}
Transition probability: {target_path.get('transition_probability', 70)}%
Expected salary range: ${target_path.get('salary_min', 100)}k - ${target_path.get('salary_max', 150)}k

Write exactly 3 paragraphs:

Paragraph 1: Why this specific path makes sense for this person based on their exact skill overlap. Reference their actual skills by name.

Paragraph 2: The single most critical skill gap to close first, and why it unlocks the path faster than other gaps.

Paragraph 3: What their first 30 days should look like. Specific, actionable, time-bound.

Be direct. Be honest. Be encouraging without being dishonest about the work required."""

        result = await self._call(prompt, 600)
        if result:
            return result

        # Fallback narrative
        return (
            f"Your existing skills in {', '.join(skill_names[:3])} provide a strong foundation "
            f"for transitioning to {target_path['title']}. The overlap between your current "
            f"expertise and the target role means you're not starting from zero.\n\n"
            f"The most critical gap to address first is {skill_gap[0] if skill_gap else 'the core skill'}. "
            f"This skill serves as a gateway — once acquired, it unlocks faster learning of the remaining skills "
            f"and gives you immediate credibility in the new role.\n\n"
            f"In your first 30 days, commit to 2-3 hours daily of structured learning. Start with a foundational "
            f"course, then build one end-to-end project that demonstrates your capabilities. Document everything "
            f"and share your progress publicly — this creates accountability and visibility."
        )

    async def generate_portfolio_insight(self, user_skills: list,
                                          portfolio_scores: dict) -> str:
        skill_info = []
        for us in user_skills:
            skill = us.skill if hasattr(us, 'skill') and us.skill else us
            prof = us.proficiency if hasattr(us, 'proficiency') else 'intermediate'
            skill_info.append(f"{skill.name} ({prof})")

        prompt = f"""You are Synthos. Analyze this professional's skill portfolio and give one sharp, specific insight in 2-3 sentences maximum.

Skills: {skill_info}
Market Alignment Score: {portfolio_scores.get('market_alignment', 70)}%
Future Readiness Score: {portfolio_scores.get('future_readiness', 65)}%

Do not be generic. Reference their actual skills. Tell them something surprising or non-obvious about their portfolio's position in the current market."""

        result = await self._call(prompt, 150)
        return result or (
            f"Your {skill_info[0].split(' (')[0] if skill_info else 'primary'} + "
            f"{skill_info[1].split(' (')[0] if len(skill_info) > 1 else 'secondary'} combination "
            f"puts you in the top 18% of professionals in your domain. Adding one high-demand skill "
            f"could unlock a $25K+ salary increase."
        )
