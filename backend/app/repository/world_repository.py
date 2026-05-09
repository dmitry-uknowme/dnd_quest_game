
from sqlalchemy import select
import uuid
from sqlalchemy.orm import Session

from database.models.world import World
from database.models.constants import STATUS_ACTIVE
from sqlalchemy.ext.asyncio import AsyncSession 


async def get_world(db: AsyncSession, world_id: str) -> World | None:
    return (await db.execute(select(World).where(World.id == world_id))).scalar_one_or_none()

async def create_world(db: AsyncSession, title: str, description: str, game_type: str, tone: str, global_goal: str, conflict_core: str, memory_seed: str, power_limits: list[str], world_rules: list[str], world_constraints: list[str]) -> World:
    new_world = World(
        id=str(uuid.uuid4()),
        title=title,
        description=description,
        genre=game_type,
        tone=tone,
        global_goal=global_goal,
        conflict_core=conflict_core,
        memory_seed=memory_seed,
        power_limits=power_limits,
        world_rules=world_rules,
        world_constraints=world_constraints
    )
    db.add(new_world)
    await db.flush()
    return new_world

