from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import selectinload
import uuid
from sqlalchemy.ext.asyncio import AsyncSession

from database.models.master_turn import MasterTurn


async def get_master_turn(db: AsyncSession, master_turn_id: str) -> MasterTurn | None:
    master_turn = (await db.execute(select(MasterTurn)
        .options(
            selectinload(MasterTurn.player_turns),
            selectinload(MasterTurn.location),
            selectinload(MasterTurn.playroom)
        )
    .where(MasterTurn.id == master_turn_id))).scalar_one_or_none()
    return master_turn

async def create_master_turn(db: AsyncSession, playroom_id: uuid.UUID, location_id: uuid.UUID, number: int, result_text: str, updates: dict) -> MasterTurn:
    new_master_turn = MasterTurn(
        id=uuid.uuid4(),
        playroom_id=playroom_id,
        location_id=location_id,
        number=number,
        result_text=result_text,
        updates=updates
    )
    db.add(new_master_turn)
    await db.flush()
    return new_master_turn