from langchain_core.messages import BaseMessage

from pydantic import BaseModel
from typing import List, Dict, Any

connected_clients = {}

class State(BaseModel):
    session_id: str
    user_prompt: str
    intents: List[str]
    metadata: List[dict]
    sql_query: str
    sql_dialect: str
    data: List[dict]
    num_numeric: int
    num_cat: int
    num_temporal: int
    num_rows: int
    cardinalities: Dict[str, Dict[str, Any]]
    ranked_graphs: List[str]
    response: str
    messages: List[BaseMessage]