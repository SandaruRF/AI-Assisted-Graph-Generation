from langchain_core.messages import BaseMessage
import copy
from pydantic import BaseModel
from typing import List, Dict, Any

connected_clients = {}

# AI-Assisted-Graph-Generation/backend/app/state.py

class GraphStateManager:
    def __init__(self):
        # Store graph history per session
        self.graph_history = {}  # session_id -> list of graph states
        self.default_state = {
            "graph_type": "line",  # default
            "x_label": "X Axis",
            "y_label": "Y Axis", 
            "legend_label": "Legend",
            "title": "Graph Title",
            "color": "#3366cc",
            "data": None,
            "session_id": None,
            "prompt_index": 0,
            "is_customization": False
        }

    def get_state(self, session_id=None):
        """Get the current state for a session"""
        if session_id and session_id in self.graph_history:
            history = self.graph_history[session_id]
            if history:
                return history[-1]  # Return the latest state
        return copy.deepcopy(self.default_state)

    def get_graph_at_index(self, session_id, prompt_index):
        """Get a specific graph state at a given prompt index"""
        if session_id in self.graph_history:
            history = self.graph_history[session_id]
            if 0 <= prompt_index < len(history):
                return copy.deepcopy(history[prompt_index])
        return None

    def add_new_graph(self, graph_state, session_id, prompt_index):
        """Add a new graph state to the history"""
        if session_id not in self.graph_history:
            self.graph_history[session_id] = []
        
        # Create a deep copy to ensure independence
        new_state = copy.deepcopy(graph_state)
        new_state["session_id"] = session_id
        new_state["prompt_index"] = prompt_index
        new_state["is_customization"] = False
        
        self.graph_history[session_id].append(new_state)
        return new_state

    def add_customized_graph(self, base_graph_state, updates, session_id, prompt_index):
        """Add a customized graph state based on a previous one"""
        if session_id not in self.graph_history:
            self.graph_history[session_id] = []
        
        # Create a deep copy of the base state
        new_state = copy.deepcopy(base_graph_state)
        
        # Apply updates
        new_state.update(updates)
        new_state["session_id"] = session_id
        new_state["prompt_index"] = prompt_index
        new_state["is_customization"] = True
        
        self.graph_history[session_id].append(new_state)
        return new_state

    def update_state(self, updates: dict, session_id=None):
        """Update the current state (legacy method - kept for compatibility)"""
        if session_id and session_id in self.graph_history:
            history = self.graph_history[session_id]
            if history:
                history[-1].update(updates)
                return history[-1]
        return copy.deepcopy(self.default_state)

    def set_graph_data(self, data, session_id=None):
        """Set graph data for the current state (legacy method)"""
        if session_id and session_id in self.graph_history:
            history = self.graph_history[session_id]
            if history:
                history[-1]["data"] = data
                return history[-1]
        return copy.deepcopy(self.default_state)

    def get_history(self, session_id):
        """Get the complete graph history for a session"""
        if session_id in self.graph_history:
            return copy.deepcopy(self.graph_history[session_id])
        return []

    def clear_history(self, session_id):
        """Clear the graph history for a session"""
        if session_id in self.graph_history:
            del self.graph_history[session_id]

# Singleton instance
graph_state_manager = GraphStateManager()

class State(BaseModel):
    session_id: str
    user_prompt: str
    suggestions: List[str]
    intents: List[str]
    metadata: Dict[str, Any]
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
    insights: List[str]
    tool_results: Dict[str, Any]
    insights_response: str
    search_plan: Dict[str, Any]
    search_results: Dict[str, Any]
    explanation: str