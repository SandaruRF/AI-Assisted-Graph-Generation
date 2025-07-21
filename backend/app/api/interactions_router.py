from fastapi import APIRouter, Depends
from pymongo import ReturnDocument
from app.models.interaction_models import InteractionData
from app.config import db
from app.utils.auth import get_current_user

router = APIRouter()
interactions_collection = db["GraphInteractions"]

@router.post("/interaction")
async def save_interaction(
    interaction: InteractionData,
    usr_email: str = Depends(get_current_user),
):
    filter_query = {"email": usr_email, "graph_name": interaction.graph_name}

    update_query = {
        "$inc": {
            "time_spent": interaction.time_spent,
            "export_count": interaction.export_count,
            "like_count": interaction.like_count,
            "dislike_count": interaction.dislike_count,
            "pan_count": interaction.pan_count,
        }
    }

    updated_doc = await interactions_collection.find_one_and_update(
        filter_query,
        update_query,
        upsert=True,
        return_document=ReturnDocument.AFTER,
    )

    return {
        "status": "success",
        "email": usr_email,
        "graph_name": interaction.graph_name,
        "updated_counts": updated_doc,
    }
