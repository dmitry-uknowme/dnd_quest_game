

import uuid
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Path, Query, Request, Response
from fastapi.responses import JSONResponse, StreamingResponse
from sqlalchemy import and_, func, or_, select, desc
from sqlalchemy.ext.asyncio import AsyncSession 
from database.db_helper import db_helper

from utils.log_route import log_route
from database.models import Agent, World
from service.world.schemas import CreateWorldRequestSchema
from service.world.world_service import create_ai_world_by_title
from service.playroom.playroom_service import playroom_start, playroom_attach_world


router = APIRouter()

@router.post("/playrooms/{playroom_id}/world")
async def create_world(
    playroom_id: str,
    body: CreateWorldRequestSchema,
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    try:
        world = await create_ai_world_by_title(session, body.title)
        world = await playroom_attach_world(session, playroom_id, world.id)
        await session.commit()
        return world
    except HTTPException as e:
        log_route(endpoint=f"/playroom/world", status=e.status_code, data=body, error=e)
        raise e
    except Exception as e:
        log_route(endpoint=f"/playroom/world", status=500, data=body, error=e)
        raise HTTPException(status_code=500)    

