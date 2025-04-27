from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class GraphInput(BaseModel):
    num_numeric: int
    num_cat: int
    has_temporal: bool
    correlation: float
    data_domain: str
    cardinality: float
    skewness: float
    query: str
    trend: bool
    compare: bool

class PredictionResult(BaseModel):
    predicted_graph: str
    confidence: float
    all_predictions: Dict[str, float]
    status: str
    message: Optional[str] = None