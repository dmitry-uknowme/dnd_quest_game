from pydantic import BaseModel
from typing import Optional
import uuid

class UserResponseSchema(BaseModel):
    model_config = {"from_attributes": True}

    id: uuid.UUID
    username: str
    email: Optional[str]


