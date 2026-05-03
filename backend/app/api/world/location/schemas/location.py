from pydantic import BaseModel, Field
from typing import Optional, List

class CreateLocationAgentResponseSchema(BaseModel):
    location_name: str
    location_description: str
    location_type: str
    choice_variants: List[str]