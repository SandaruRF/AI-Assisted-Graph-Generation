from pydantic import BaseModel
from typing import List

class State(BaseModel):
    session_id: str
    user_prompt: str
    intents: List[str]
    metadata: List[dict]
    response: str