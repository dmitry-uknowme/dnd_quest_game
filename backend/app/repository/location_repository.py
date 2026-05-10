from sqlalchemy.orm import selectinload
from typing import List
from sqlalchemy import select
import uuid
from database.models.location import Location
from sqlalchemy.ext.asyncio import AsyncSession 

async def get_location(db: AsyncSession, location_id: str) -> Location | None:
    return (await db.execute(
        select(Location)
        .options(
            selectinload(Location.world),
        )
        .where(Location.id == location_id))).scalar_one_or_none()

async def create_location(
    db: AsyncSession, 
    title: str, 
    description: str, 
    type: str,
    answer_variants: List[str] = None
) -> Location:
    new_location = Location(
        id=uuid.uuid4(),
        title=title,
        description=description,
        type=type,
        answer_variants=answer_variants or []
    )
    db.add(new_location)
    await db.flush()
    return new_location
