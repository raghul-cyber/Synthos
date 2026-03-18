import networkx as nx
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.skill import Skill, SkillAdjacency, UserSkill


class SkillGraphService:

    async def build_user_graph(self, session: AsyncSession, user_skill_ids: list[str]) -> nx.Graph:
        G = nx.Graph()
        # Get user skills
        result = await session.execute(
            select(Skill).where(Skill.id.in_(user_skill_ids))
        )
        user_skills = result.scalars().all()
        for s in user_skills:
            G.add_node(str(s.id), name=s.name, owned=True,
                       demand=s.market_demand_score, category=s.category,
                       trend=s.demand_trend)

        # Get adjacencies
        result = await session.execute(
            select(SkillAdjacency).where(
                SkillAdjacency.skill_from.in_(user_skill_ids)
            )
        )
        adjacencies = result.scalars().all()
        adj_skill_ids = set()
        for a in adjacencies:
            adj_skill_ids.add(str(a.skill_to))

        # Load adjacent skills
        if adj_skill_ids:
            result = await session.execute(
                select(Skill).where(Skill.id.in_(list(adj_skill_ids)))
            )
            adj_skills = result.scalars().all()
            for s in adj_skills:
                if str(s.id) not in G:
                    G.add_node(str(s.id), name=s.name, owned=False,
                               demand=s.market_demand_score, category=s.category,
                               trend=s.demand_trend)

        # Add edges
        for a in adjacencies:
            if str(a.skill_from) in G and str(a.skill_to) in G:
                G.add_edge(str(a.skill_from), str(a.skill_to),
                           weight=float(a.adjacency_score))

        return G

    async def get_adjacent_skills(self, session: AsyncSession,
                                   user_skill_ids: list[str],
                                   limit: int = 10) -> list[dict]:
        owned_set = set(str(sid) for sid in user_skill_ids)

        result = await session.execute(
            select(SkillAdjacency, Skill).join(
                Skill, SkillAdjacency.skill_to == Skill.id
            ).where(
                SkillAdjacency.skill_from.in_(user_skill_ids)
            ).order_by(SkillAdjacency.adjacency_score.desc())
        )
        rows = result.all()

        seen = set()
        recommendations = []
        for adj, skill in rows:
            sid = str(skill.id)
            if sid in owned_set or sid in seen:
                continue
            seen.add(sid)
            composite_score: float = float(adj.adjacency_score) * 0.6 + (skill.market_demand_score / 100) * 0.4
            recommendations.append({
                **skill.to_dict(),
                "adjacency_score": float(adj.adjacency_score),
                "composite_score": float(f"{composite_score:.3f}"),
                "demand_indicator": "🔥 Hot" if skill.market_demand_score >= 85
                    else ("→ Stable" if skill.demand_trend != "declining" else "↓ Declining"),
            })
            if len(recommendations) >= limit:
                break

        return sorted(recommendations, key=lambda x: x["composite_score"], reverse=True)

    async def get_graph_data_for_viz(self, session: AsyncSession,
                                      user_skill_ids: list[str]) -> dict:
        G = await self.build_user_graph(session, user_skill_ids)
        nodes = []
        for node_id, data in G.nodes(data=True):
            nodes.append({
                "id": node_id,
                "name": data.get("name", ""),
                "owned": data.get("owned", False),
                "demand": data.get("demand", 50),
                "category": data.get("category", ""),
                "trend": data.get("trend", "stable"),
                "radius": 24 if data.get("owned") else 18,
                "hot": data.get("demand", 0) >= 85,
            })

        edges = []
        for u, v, data in G.edges(data=True):
            weight = data.get("weight", 0.5)
            edges.append({
                "source": u,
                "target": v,
                "strength": weight,
                "strong": weight > 0.6,
            })

        return {"nodes": nodes, "edges": edges}
