from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
import uuid
from sqlalchemy.orm import Session

from database.models import Agent

async def get_agent(db: AsyncSession, agent_id: str) -> Agent | None:
    return (await db.execute(select(Agent).where(Agent.id == agent_id))).scalar_one_or_none()

async def get_agent_by_name(db: AsyncSession, agent_name: str) -> Agent | None:
    return (await db.execute(select(Agent).where(Agent.name == agent_name))).scalar_one_or_none()

async def create_agent(db: AsyncSession, name: str, prompt: str, model: str) -> Agent:
    new_agent = Agent(
        id = uuid.uuid4(),
        name = name,
        prompt = prompt,
        model = model,
    )
    db.add(new_agent)
    await db.flush()
    return new_agent
