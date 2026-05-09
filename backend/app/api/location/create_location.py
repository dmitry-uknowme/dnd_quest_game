

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

@router.post("/world/{world_id}/location")
async def create_location(
    world_id: str,
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    try:
        # world = await world_service.get_world(session, world_id)
        playroom = await playroom_service.get_playroom_by_world_id(session, world_id)
        first_location = await location_service.create_ai_first_location(session, world_id, playroom.id)
        return first_location
    except HTTPException as e:
        log_route(endpoint=f"/world/{world_id}/location", status=e.status_code, data={"world_id": world_id, "playroom_id": playroom.id}, error=e)
        raise e
    except Exception as e:
        log_route(endpoint=f"/world/{world_id}/location", status=500, data={"world_id": world_id, "playroom_id": playroom.id}, error=e)
        raise HTTPException(status_code=500)    

