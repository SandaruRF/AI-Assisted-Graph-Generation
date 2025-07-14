from fastapi import APIRouter, HTTPException, Depends
from app.utils.auth import get_current_user

from pymongo import MongoClient

from app.models.interaction_models import InteractionData
from app.config import settings
from app.utils.auth import get_current_user

client = MongoClient(settings.MONGO_URI)
db = client[settings.DATABASE_NAME]
interactions_collection = db["GraphInteractions"]

interactions_router = APIRouter()

@interactions_router.post("/interactions")
async def save_interaction(interaction: InteractionData, usr_email: str = Depends(get_current_user)):
    try:
        data = interaction.dict()
        data["email"] = usr_email
        result = interactions_collection.insert_one(data)
        return {
            "status": "success",
            "id": str(result.inserted_id),
            "graph_name": interaction.graph_name
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
