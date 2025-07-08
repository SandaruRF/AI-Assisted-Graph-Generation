from langchain_core.messages import BaseMessage

from pydantic import BaseModel
from typing import List, Dict, Any

connected_clients = {}



# AI-Assisted-Graph-Generation/backend/app/state.py

class GraphStateManager:
    def __init__(self):
        self.state = {
            "graph_type": "line",  # default
            "x_label": "X Axis",
            "y_label": "Y Axis", 
            "legend_label": "Legend",
            "title": "Graph Title",
            "color": "#3366cc",
            "data": None,
            "session_id": None
        }

    def get_state(self, session_id=None):
        if session_id and self.state["session_id"] == session_id:
            return self.state
        return self.state

    def update_state(self, updates: dict, session_id=None):
        if session_id:
            self.state["session_id"] = session_id
        self.state.update(updates)
        return self.state

    def set_graph_data(self, data, session_id=None):
        if session_id:
            self.state["session_id"] = session_id
        self.state["data"] = data
        return self.state

# Singleton instance
graph_state_manager = GraphStateManager()

class State(BaseModel):
    session_id: str
    user_prompt: str
    intents: List[str]
    metadata: List[dict]
    sql_query: str
    sql_dialect: str
    original_data: List[dict]
    rearranged_data: List[dict]
    num_numeric: int
    num_cat: int
    num_temporal: int
    num_rows: int
    cardinalities: Dict[str, Dict[str, Any]]
    suitable_graphs: List[str]
    ranked_graphs: List[str]
    response: str
    messages: List[BaseMessage]