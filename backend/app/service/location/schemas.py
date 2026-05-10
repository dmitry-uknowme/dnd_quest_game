
from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID

from service.world.schemas import WorldResponseSchema

class CreateLocationAgentResponseSchema(BaseModel):
    location_name: str
    location_description: str
    location_type: str
    choice_variants: List[str]


class LocationResponseSchema(BaseModel):
    model_config = {"from_attributes": True}

    id: UUID
    title: str
    description: str
    type: str
    world: Optional[WorldResponseSchema] = None
    

class FirstLocationResponseSchema(LocationResponseSchema):
    model_config = {"from_attributes": True}

    answer_variants: Optional[List[str]] = Field(default_factory=list)


    
    