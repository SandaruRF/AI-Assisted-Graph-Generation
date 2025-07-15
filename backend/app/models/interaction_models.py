from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class InteractionData(BaseModel):
    graph_name: str
    time_spent: int
    export_count: int
    like_count: int
    dislike_count: int
    pan_count: int
