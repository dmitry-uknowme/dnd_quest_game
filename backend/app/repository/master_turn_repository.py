
from typing import List
from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import selectinload
import uuid
from sqlalchemy.ext.asyncio import AsyncSession

from database.models.master_turn import MasterTurn
from database.models.player_turn import PlayerTurn

from service.playroom import playroom_service


async def get_master_turn(db: AsyncSession, master_turn_id: str) -> MasterTurn | None:
    master_turn = (await db.execute(select(MasterTurn)
        .options(
            selectinload(MasterTurn.player_turns).selectinload(PlayerTurn.player),
            selectinload(MasterTurn.location),
            selectinload(MasterTurn.playroom)
        )
    .where(MasterTurn.id == master_turn_id))).scalar_one_or_none()
    return master_turn

async def get_all_master_turns_by_playroom_id(db: AsyncSession, playroom_id: str) -> list[MasterTurn]:
    master_turns = (await db.execute(select(MasterTurn)
        .options(
            selectinload(MasterTurn.player_turns).selectinload(PlayerTurn.player),
            selectinload(MasterTurn.location),
            selectinload(MasterTurn.playroom)
        )
    .where(MasterTurn.playroom_id == playroom_id).order_by(MasterTurn.number.desc()))).scalars().all()
    return list(master_turns)

async def get_players_turns_by_master_turn_id(db: AsyncSession, master_turn_id: str) -> list[PlayerTurn]:
    player_turns = (await db.execute(select(PlayerTurn)
        .options(
            selectinload(PlayerTurn.master_turn).selectinload(MasterTurn.playroom),
            selectinload(PlayerTurn.player)
        )
    .where(PlayerTurn.master_turn_id == master_turn_id))).scalars().all()
    return list(player_turns)

async def get_master_turn_by_number(db: AsyncSession, playroom_id: str, number: int) -> MasterTurn | None:
    master_turn = (await db.execute(select(MasterTurn)
        .options(
            selectinload(MasterTurn.player_turns).selectinload(PlayerTurn.player),
            selectinload(MasterTurn.location),
            selectinload(MasterTurn.playroom)
        )
    .where(MasterTurn.playroom_id == playroom_id).where(MasterTurn.number == number))).scalar_one_or_none()
    return master_turn

async def create_master_turn(db: AsyncSession, playroom_id: uuid.UUID, location_id: uuid.UUID, number: int) -> MasterTurn:
    new_master_turn = MasterTurn(
        id=uuid.uuid4(),
        number=number,
        result_text=None,
        state_updates=None,
        playroom_id=playroom_id,
        location_id=location_id,
    )
    db.add(new_master_turn)
    await db.flush()
    return new_master_turn

async def get_last_master_turn_number(db: AsyncSession, playroom_id: str) -> int:
    last_master_turn = (await db.execute(select(MasterTurn)
        .options(
            selectinload(MasterTurn.playroom)
        )
    .where(MasterTurn.playroom_id == playroom_id).order_by(MasterTurn.number.desc()).limit(1))).scalar_one_or_none()
    if last_master_turn:
        return last_master_turn.number
    return 0

async def finish_master_turn(db: AsyncSession, master_turn_id: str, result_text: str, answer_variants: List[str], state_updates: dict):
    master_turn = await get_master_turn(db, master_turn_id)
    master_turn.result_text = result_text
    master_turn.answer_variants = answer_variants
    master_turn.state_updates = state_updates
    await db.flush()
    return master_turn