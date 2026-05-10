from typing import List
from pydantic import BaseModel
from typing import Optional
import uuid

from service.user.schemas import UserResponseSchema

class MasterTurnResponseSchema(BaseModel):
    model_config = {"from_attributes": True}

    id: uuid.UUID
    number: int
    result_text: Optional[str]
    state_updates: Optional[dict]
    playroom_id: uuid.UUID
    location_id: uuid.UUID
    player_turns: List["PlayerTurnResponseSchema"]
    choice_variants: Optional[List[str]] = None

class PlayerTurnResponseSchema(BaseModel):
    model_config = {"from_attributes": True}

    id: uuid.UUID
    number: Optional[int]
    input_text: str
    state_updates: Optional[dict]
    player: UserResponseSchema
    

class PlayroomMakeTurnRequestSchema(BaseModel):
    input_text: str

class TurnHandlerAgentResponseSchema(BaseModel):
    model_config = {"from_attributes": True}

    turn_summary: str
    inventory_changes: list 
    stat_changes: list
    npc_reactions: list
    location_changes: list
    transition: dict
    memory_seed: str
    choice_variants: List[str]