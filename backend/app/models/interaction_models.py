from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class InteractionData(BaseModel):
    graph_name: str
    time_spent: int
    export_count: int = 0
    like_count: int = 0
    dislike_count: int = 0
    pan_count: int = 0
    timestamp: Optional[datetime] = Field(default_factory=datetime.utcnow)
