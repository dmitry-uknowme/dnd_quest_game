
from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID

from service.world.schemas import WorldResponseSchema
from service.location.schemas import FirstLocationResponseSchema

class CreatePlayroomRequestSchema(BaseModel):
    title: str

class PlayroomResponseSchema(BaseModel):
    model_config = {"from_attributes": True}

    id: UUID
    title: str
    status: str

    world: Optional["WorldResponseSchema"]
    active_location: Optional["FirstLocationResponseSchema"]
    active_turn_number: int
    
    