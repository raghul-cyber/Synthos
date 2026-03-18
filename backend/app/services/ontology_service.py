from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..models.skill import Skill


SKILL_ONTOLOGY = {
    "Programming": ["Python", "JavaScript", "TypeScript", "SQL", "Java", "Go",
                     "Rust", "R", "C++", "Bash", "NoSQL", "GraphQL", "REST APIs",
                     "YAML", "Node.js", "React", "Redis", "PostgreSQL", "MongoDB",
                     "FastAPI", "Django"],
    "Data & AI": ["Machine Learning", "Deep Learning", "NLP", "Computer Vision",
                   "Data Analysis", "Statistics", "TensorFlow", "PyTorch",
                   "scikit-learn", "Tableau", "Power BI", "Apache Spark", "dbt",
                   "Airflow", "MLOps", "Data Engineering"],
    "Cloud & DevOps": ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform",
                        "CI/CD", "Linux", "Networking", "Security", "Test Automation",
                        "Microservices"],
    "Product & Design": ["Product Management", "UX Design", "Figma", "User Research",
                          "A/B Testing", "Roadmapping", "Agile", "Scrum",
                          "Product Metrics"],
    "Business & Soft Skills": ["Leadership", "Communication", "Strategy", "Finance",
                                 "Marketing", "Sales", "Negotiation",
                                 "Data Storytelling", "Excel", "Manual Testing",
                                 "Basic HTML/CSS"],
    "Emerging": ["Prompt Engineering", "LLM Fine-tuning", "RAG Systems",
                  "AI Agents", "Vector Databases", "Web3", "Smart Contracts",
                  "AR/VR Development"],
}


class OntologyService:

    async def get_full_ontology(self, session: AsyncSession) -> dict:
        result = await session.execute(
            select(Skill).order_by(Skill.category, Skill.market_demand_score.desc())
        )
        skills = result.scalars().all()

        ontology = {}
        for skill in skills:
            if skill.category not in ontology:
                ontology[skill.category] = []
            ontology[skill.category].append(skill.to_dict())

        return ontology

    async def search_skills(self, session: AsyncSession, query: str,
                             limit: int = 10) -> list[dict]:
        query_lower = f"%{query.lower()}%"
        result = await session.execute(
            select(Skill).where(
                Skill.name.ilike(query_lower)
            ).order_by(Skill.market_demand_score.desc()).limit(limit)
        )
        return [s.to_dict() for s in result.scalars().all()]

    def get_static_ontology(self) -> dict:
        return SKILL_ONTOLOGY
