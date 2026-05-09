

import uuid
import json
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Path, Query, Request, Response
from fastapi.responses import JSONResponse, StreamingResponse
from sqlalchemy import and_, func, or_, select, desc
from sqlalchemy.ext.asyncio import AsyncSession 
from database.db_helper import db_helper

# from service.agent_ai_stream import agent_make_history, agent_ai_stream, agent_ai
from utils.log_route import log_route
from database.models import Agent, World
from .schemas.location import CreateLocationAgentResponseSchema


router = APIRouter()

@router.post("/playroom/world/{world_id}/location")
async def world_create_location(
    world_id: str = Path(..., description="World id"),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    try:
        stmt = select(Agent).where(Agent.name == "LOCATION_CREATE_AGENT")
        agent = (await session.execute(stmt)).scalars().first()
        stmt = select(World).where(World.id == world_id)
        world = (await session.execute(stmt)).scalars().first()
        world_json = {
            "genre": world.genre,
            "tone": world.tone,
            "world_rules": world.world_rules,
            "power_limits": world.power_limits,
            "global_goal": world.global_goal,
            "conflict_core": world.conflict_core,
            "world_constraints": world.world_constraints
        }
        # world_json = json.dumps(world_json, ensure_ascii=False)
        # messages, sum_tokens, max_output_tokens = await agent_make_history(agent=agent, messages=[{"role": "user", "content": f"**WORLD JSON**: {world_json}"}])
        # response = agent_ai(messages, model="nvidia/nemotron-3-super-120b-a12b:free", temperature=None, response_model=CreateLocationAgentResponseSchema, response_format=agent.response_format, max_output_tokens=2000, subscription_tokens_left=0)
        
        # new_world = World(
        #     id=str(uuid.uuid4()),
        #     title=response.world_name,
        #     description=response.world_description,
        #     genre=response.genre,
        #     tone=response.tone,
        #     global_goal=response.global_goal,
        #     conflict_core=response.conflict_core,
        #     memory_seed=response.memory_seed,
        #     power_limits=".".join(response.power_limits),
        #     world_rules=".".join(response.world_rules),
        #     world_constraints=".".join(response.world_constraints)
        # )
        # session.add(new_world)
        # await session.commit()
        # return response
    except HTTPException as e:
        log_route(endpoint=f"/playroom/world", status=e.status_code, data={"world_id": world_id}, error=e)
        raise e
    except Exception as e:
        log_route(endpoint=f"/playroom/world", status=500, data={"world_id": world_id}, error=e)
        raise HTTPException(status_code=500)    

    # async def on_complete_stream(message_content, total_tokens_used, input_tokens_used, output_tokens_used):
    #     print("complete", message_content, total_tokens_used, input_tokens_used, output_tokens_used)

    # async def generator():
    #     async for chunk in agent_ai_stream(messages, "mistralai/devstral-2512:free", 1, max_output_tokens=500, on_complete=on_complete_stream):
    #         yield chunk
    #     # log_route(endpoint=f"/chats/{activity_type}/ai_message/send", status=200, data=body, response={})
    # return StreamingResponse(generator(), media_type="text/event-stream", headers={"Cache-Control": "no-cache"})

