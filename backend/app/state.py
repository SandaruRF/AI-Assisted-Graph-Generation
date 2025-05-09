from langchain_core.messages import BaseMessage

from pydantic import BaseModel
from typing import List

connected_clients = {}

class State(BaseModel):
    session_id: str
    user_prompt: str
    intents: List[str]
    metadata: List[dict]
    sql_query: str
    sql_dialect: str
    data: List[dict]
    response: str
    messages: List[BaseMessage]