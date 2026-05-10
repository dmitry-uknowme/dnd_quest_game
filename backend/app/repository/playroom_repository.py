from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import selectinload
import uuid
from sqlalchemy.ext.asyncio import AsyncSession

from database.models.playroom import Playroom
from database.models.constants import STATUS_ACTIVE

async def get_playroom(db: AsyncSession, playroom_id: str) -> Playroom | None:
    playroom = (await db.execute(select(Playroom)
    .options(
        selectinload(Playroom.world),
        selectinload(Playroom.active_location)
    )
    .where(Playroom.id == playroom_id))).scalar_one_or_none()
    return playroom

async def get_all_playrooms(db: AsyncSession) -> list[Playroom] | None:
    playrooms = (await db.execute(select(Playroom).order_by(Playroom.created_at.desc())
    .options(
        selectinload(Playroom.world),
        selectinload(Playroom.active_location)
    ))).scalars().all()
    return playrooms

async def create_playroom(db: AsyncSession, title: str, leader_id: str) -> Playroom:
    new_playroom = Playroom(
        id = str(uuid.uuid4()),
        title = title,
        status = STATUS_ACTIVE,
        active_turn_number = 0,
        # leader_id = leader_id,
        world_id = None
    )
    db.add(new_playroom)
    await db.flush()
    return new_playroom

async def playroom_attach_world(db: AsyncSession, playroom_id: str, world_id: str) -> Playroom:
    playroom = await get_playroom(db, playroom_id)
    playroom.world_id = world_id
    await db.flush()
    return playroom

async def playroom_attach_active_location(db: AsyncSession, playroom_id: str, location_id: str) -> Playroom:
    playroom = await get_playroom(db, playroom_id)
    playroom.active_location_id = location_id
    await db.flush()
    return playroom

async def playroom_set_status(db: AsyncSession, playroom_id: str, status: str) -> Playroom:
    playroom = await get_playroom(db, playroom_id)
    playroom.status = status
    await db.flush()
    return playroom

async def playroom_set_active_turn_number(db: AsyncSession, playroom_id: str, turn_number: int) -> int | None:
    playroom = await get_playroom(db, playroom_id)
    playroom.active_turn_number = turn_number
    await db.flush()
    return playroom.active_turn_number
