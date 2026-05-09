from typing import List
from pydantic import BaseModel
from typing import Optional
import uuid


class CreateWorldRequestSchema(BaseModel):
    title: str

class CreateWorldAgentResponseSchema(BaseModel):
    world_name: str
    world_description: str
    genre: str
    tone: str
    global_goal: str
    conflict_core: str
    memory_seed: str
    power_limits: List[str]
    world_rules: List[str]
    world_constraints: List[str]

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
