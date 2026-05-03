from pydantic import BaseModel, Field
from typing import Optional, List

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