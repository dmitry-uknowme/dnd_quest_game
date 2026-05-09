

import uuid
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Path, Query, Request, Response
from fastapi.responses import JSONResponse, StreamingResponse
from sqlalchemy import and_, func, or_, select, desc
from sqlalchemy.ext.asyncio import AsyncSession 
from database.db_helper import db_helper

from utils.log_route import log_route
from service.location import location_service
from service.world import world_service
from service.playroom import playroom_service

router = APIRouter()

@router.post("/playrooms/{playroom_id}/start")
async def playroom_start(
    playroom_id: str = Path(..., description="Playroom id"),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    try:
        playroom = await playroom_service.get_playroom(session, playroom_id)
        world = await world_service.get_world(session, playroom.world.id)
        first_location = await location_service.create_ai_first_location(session, playroom_id, world.id)
        await playroom_service.playroom_start(session, playroom_id, world.id)
        return first_location
    except HTTPException as e:
        log_route(endpoint=f"/playroom/{playroom_id}/start", status=e.status_code, data={"playroom_id": playroom_id}, error=e)
        raise e
    except Exception as e:
        log_route(endpoint=f"/playroom/{playroom_id}/start", status=500, data={"playroom_id": playroom_id}, error=e)
        raise HTTPException(status_code=500)    

