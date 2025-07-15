from fastapi import APIRouter, HTTPException, Depends
from app.utils.auth import get_current_user
from app.models.interaction_models import InteractionData
from app.config import db
from app.utils.auth import get_current_user



router = APIRouter()
interactions_collection = db["GraphInteractions"]

@router.post("/interaction")
async def save_interaction(
    interaction: InteractionData,
    usr_email: str = Depends(get_current_user)
):
    data = interaction.model_dump()
    data["email"] = usr_email
    await interactions_collection.insert_one(data)
    return {
        "status": "success",
        "email": usr_email,
        "graph_name": interaction.graph_name
    }
