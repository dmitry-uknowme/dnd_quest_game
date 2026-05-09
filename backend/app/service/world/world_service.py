
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
import uuid
from sqlalchemy.orm import Session

from database.models import World, Playroom
from database.models.constants import STATUS_ACTIVE, STATUS_STARTED

from repository import world_repository

from service.agent_ai_service import agent_ai, agent_make_history
from repository import agent_repository
from .schemas import WorldResponseSchema, CreateWorldAgentResponseSchema


async def get_world(db: AsyncSession, world_id: str) -> WorldResponseSchema | None:
    world = await world_repository.get_world(db, world_id)

    if not world:
        raise HTTPException(status_code=404, detail="World not found")

    return WorldResponseSchema.model_validate(world)

async def create_ai_world_by_title(db: AsyncSession, title: str) -> WorldResponseSchema:
    agent = await agent_repository.get_agent_by_name(db, "WORLD_CREATE_AGENT")
    messages, sum_tokens, max_output_tokens = await agent_make_history(agent=agent, messages=[{"role": "user", "content": f"Сгенерируй мир для игры по этому описанию: {title}"}])
    response = agent_ai(messages, model="nvidia/nemotron-3-super-120b-a12b:free", temperature=None, response_model=CreateWorldAgentResponseSchema, response_format=agent.response_format, max_output_tokens=2000, subscription_tokens_left=0)

    new_world = await world_repository.create_world(
        db,
        title=response.world_name,
        description=response.world_description,
        game_type=response.genre,
        tone=response.tone,
        global_goal=response.global_goal,
        conflict_core=response.conflict_core,
        memory_seed=response.memory_seed,
        power_limits=".".join(response.power_limits),
        world_rules=".".join(response.world_rules),
        world_constraints=".".join(response.world_constraints)
    )

    return WorldResponseSchema.model_validate(new_world)


 

  

