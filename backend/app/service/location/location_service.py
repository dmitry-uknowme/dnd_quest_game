from service.world import world_service
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
import uuid
import json
from sqlalchemy.orm import Session

from database.models import Location

from service.agent_ai_service import agent_ai, agent_make_history
from repository import agent_repository, location_repository
from service.playroom.playroom_service import playroom_attach_active_location
from .schemas import FirstLocationResponseSchema, LocationResponseSchema, CreateLocationAgentResponseSchema


async def get_location(db: AsyncSession, location_id: str) -> LocationResponseSchema | None:
    location = await location_repository.get_location(db, location_id)

    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    return LocationResponseSchema.model_validate(location)
    
async def create_ai_first_location(db: AsyncSession, playroom_id: str, world_id: str) -> FirstLocationResponseSchema:
    agent = await agent_repository.get_agent_by_name(db, "LOCATION_CREATE_AGENT")
    world = await world_service.get_world(db, world_id)
    world_json = {
        "genre": world.genre,
        "tone": world.tone,
        "world_rules": world.world_rules,
        "power_limits": world.power_limits,
        "global_goal": world.global_goal,
        "conflict_core": world.conflict_core,
        "world_constraints": world.world_constraints
    }
    world_json = json.dumps(world_json, ensure_ascii=False)

    messages, sum_tokens, max_output_tokens = await agent_make_history(agent=agent, messages=[{"role": "user", "content": f"**WORLD JSON**:\n\n {world_json}"}])    
    response = agent_ai(messages, model="nvidia/nemotron-3-super-120b-a12b:free", temperature=None, response_model=CreateLocationAgentResponseSchema, response_format=agent.response_format, max_output_tokens=2000, subscription_tokens_left=0)

    new_location = await location_repository.create_location(
        db,
        title=response.location_name,
        description=response.location_description,
        type=response.location_type,
        answer_variants=response.choice_variants
    )

    await playroom_attach_active_location(db, playroom_id, new_location.id)

    result = FirstLocationResponseSchema(
        id=new_location.id,
        title=new_location.title,
        description=new_location.description,
        type=new_location.type,
        answer_variants=new_location.answer_variants
    )

    await db.commit()

    return result
