
from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID

from service.world.schemas import WorldResponseSchema

class CreatePlayroomRequestSchema(BaseModel):
    title: str

class PlayroomResponseSchema(BaseModel):
    model_config = {"from_attributes": True}

    id: UUID
    title: str
    status: str

    world: Optional["WorldResponseSchema"]
    