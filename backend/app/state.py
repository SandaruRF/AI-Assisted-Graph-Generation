from langchain_core.messages import BaseMessage

from pydantic import BaseModel
from typing import List, Dict, Any, Optional

connected_clients = {}

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

    # 🔽 ADD THESE FOR CUSTOMIZATION SUPPORT
    chart_type: Optional[str] = "line"
    colors: Optional[List[str]] = ["blue", "orange"]
    x_label: Optional[str] = "X-Axis"
    y_label: Optional[str] = "Y-Axis"
    legend_labels: Optional[Dict[str, str]] = {}