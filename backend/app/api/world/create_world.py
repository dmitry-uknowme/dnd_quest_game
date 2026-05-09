

import uuid
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Path, Query, Request, Response
from fastapi.responses import JSONResponse, StreamingResponse
from sqlalchemy import and_, func, or_, select, desc
from sqlalchemy.ext.asyncio import AsyncSession 
from database.db_helper import db_helper

from utils.log_route import log_route
from database.models import Agent, World
from .schemas.world import CreateWorldRequestSchema, CreateWorldAgentResponseSchema

# from service.world.world_service import create_ai_world_by_title
from service.world.world_service import create_ai_world_by_title
from service.playroom.playroom_service import playroom_start, get_playroom


router = APIRouter()

@router.post("/playroom/{playroom_id}/world")
async def create_world(
    playroom_id: str,
    body: CreateWorldRequestSchema,
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    try:
        # stmt = select(Agent).where(Agent.name == "WORLD_CREATE_AGENT")
        # agent = (await session.execute(stmt)).scalars().first()
        # messages, sum_tokens, max_output_tokens = await agent_make_history(agent=agent, messages=[{"role": "user", "content": f"Сгенерируй мир для игры по этому описанию: {body.title}"}])
        # response = agent_ai(messages, model="nvidia/nemotron-3-super-120b-a12b:free", temperature=None, response_model=CreateWorldAgentResponseSchema, response_format=agent.response_format, max_output_tokens=2000, subscription_tokens_left=0)
        
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
        world = await create_ai_world_by_title(session, body.title)
        # playroom = await get_playroom(session, playroomId)
        

        await playroom_start(session, playroom_id, world.id)
        return world
    except HTTPException as e:
        log_route(endpoint=f"/playroom/world", status=e.status_code, data=body, error=e)
        raise e
    except Exception as e:
        log_route(endpoint=f"/playroom/world", status=500, data=body, error=e)
        raise HTTPException(status_code=500)    

    # async def on_complete_stream(message_content, total_tokens_used, input_tokens_used, output_tokens_used):
    #     print("complete", message_content, total_tokens_used, input_tokens_used, output_tokens_used)

    # async def generator():
    #     async for chunk in agent_ai_stream(messages, "mistralai/devstral-2512:free", 1, max_output_tokens=500, on_complete=on_complete_stream):
    #         yield chunk
    #     # log_route(endpoint=f"/chats/{activity_type}/ai_message/send", status=200, data=body, response={})
    # return StreamingResponse(generator(), media_type="text/event-stream", headers={"Cache-Control": "no-cache"})

