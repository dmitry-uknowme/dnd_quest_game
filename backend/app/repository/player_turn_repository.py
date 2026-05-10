from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import selectinload
import uuid
from sqlalchemy.ext.asyncio import AsyncSession

from database.models.player_turn import PlayerTurn
from database.models.master_turn import MasterTurn


async def get_player_turn(db: AsyncSession, player_turn_id: str) -> PlayerTurn | None:
    player_turn = (await db.execute(select(PlayerTurn)
        .options(
            selectinload(PlayerTurn.master_turn),
        )
    .where(PlayerTurn.id == player_turn_id))).scalar_one_or_none()
    return player_turn

async def create_player_turn(db: AsyncSession, master_turn_id: uuid.UUID, number: int, input_text: str, updates: dict) -> PlayerTurn:
    new_player_turn = PlayerTurn(
        id=uuid.uuid4(),
        master_turn_id=master_turn_id,
        number=number,
        input_text=input_text,
        updates=updates
    )
    db.add(new_player_turn)
    await db.flush()
    return new_player_turn