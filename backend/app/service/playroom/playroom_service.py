from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
import uuid
from sqlalchemy.orm import Session

from database.models.playroom import Playroom
from database.models.constants import STATUS_ACTIVE, STATUS_STARTED
from repository import playroom_repository
from service.world.world_service import get_world
from service.playroom.schemas import PlayroomResponseSchema

async def get_playroom(db: AsyncSession, playroom_id: str) -> PlayroomResponseSchema | None:
    playroom = await playroom_repository.get_playroom(db, playroom_id)

    if not playroom:
        raise HTTPException(status_code=404, detail="Playroom not found")

    return PlayroomResponseSchema.model_validate(playroom)

async def create_playroom(db: AsyncSession, title: str, leader_id: str) -> PlayroomResponseSchema:
    playroom = await playroom_repository.create_playroom(db, title, leader_id)
    return PlayroomResponseSchema.model_validate(playroom)

async def playroom_start(db: AsyncSession, playroom_id: str, world_id: str) -> Playroom:
    playroom = await get_playroom(db, playroom_id)
    world = await get_world(db, world_id)

    if not playroom:
        raise HTTPException(status_code=404, detail="Playroom not found")
    # if not world:
    #     raise HTTPException(status_code=404, detail="World not found")
    if playroom.status != STATUS_ACTIVE:
        raise HTTPException(status_code=400, detail="Playroom is not active")

    playroom = await playroom_repository.playroom_attach_world(db, playroom_id, world_id)
    playroom = await playroom_repository.playroom_set_status(db, playroom_id, STATUS_STARTED)
    await db.commit()
    return playroom

 

  

