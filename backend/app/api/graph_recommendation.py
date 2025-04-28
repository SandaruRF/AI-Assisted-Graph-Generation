from fastapi import APIRouter, HTTPException
from pathlib import Path

from services.graph_recommendation import GraphModel
from models.graph_recommendation_model import GraphInput, PredictionResult

router = APIRouter()
model = GraphModel()

@router.on_event("startup")
async def startup_event():
    """Load model on startup if available"""
    model.load_models()

@router.post("/predict", response_model=PredictionResult)
async def predict_graph(input_data: GraphInput):
    """Endpoint to predict the best graph type"""
    try:
        result = model.predict(input_data.dict())
        if result["status"] != "success":
            raise HTTPException(status_code=400, detail=result["message"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/train")
async def train_model():
    try:
        data_path = Path(__file__).parent.parent / "data" / "recdataset.csv"
        if not data_path.exists():
            raise HTTPException(status_code=404, detail="Training data not found")
        
        result = model.train_model(str(data_path))
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/model-status")
async def model_status():
    """Check if model is loaded and ready"""
    return {
        "is_trained": model.is_trained,
        "num_classes": len(model.label_encoder.classes_) if model.is_trained else 0
    }