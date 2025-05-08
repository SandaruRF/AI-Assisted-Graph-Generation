from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any

from app.agents.visualization_agent.feature_extractor import rearrange_dataset

router = APIRouter()

@router.post("/graph-data")
def send_graph_data(dataset: List[Dict[str, Any]]):
    result = rearrange_dataset(dataset)
    return result