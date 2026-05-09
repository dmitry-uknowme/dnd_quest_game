from pydantic import BaseModel
from typing import Optional
import uuid


class WorldResponseSchema(BaseModel):
    model_config = {"from_attributes": True}

    id: uuid.UUID
    title: str
    description: str
    genre: str
    tone: str
    global_goal: str
    conflict_core: str
    memory_seed: str
    power_limits: str
    world_rules: str
    world_constraints: str