from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import uuid

from app.config import conversation_collection

router = APIRouter()

class ConversationEntry(BaseModel):
    id: Optional[str] = None
    session_id: str
    prompt_index: int
    user_prompt: str
    result: Optional[dict] = None
    traces: Optional[List[str]] = []
    graph_state: Optional[dict] = None
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()

@router.post("/save-prompt", response_model=dict)
async def save_prompt(session_id: str, prompt_index: int, user_prompt: str):
    """Save user prompt to database"""
    try:
        # Create ConversationEntry instance
        entry_data = ConversationEntry(
            id=str(uuid.uuid4()),
            session_id=session_id,
            prompt_index=prompt_index,
            user_prompt=user_prompt
        )
        
        # Convert to dict for MongoDB insertion
        entry_dict = entry_data.model_dump()
        
        result = await conversation_collection.insert_one(entry_dict)
        return {"success": True, "id": entry_data.id}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save prompt: {str(e)}")

@router.put("/update-result")
async def update_result(session_id: str, prompt_index: int, result: dict, graph_state: dict = None):
    """Update conversation entry with result"""
    try:
        update_data = {
            "result": result,
            "updated_at": datetime.utcnow()
        }
        
        if graph_state:
            update_data["graph_state"] = graph_state
        
        result = await conversation_collection.update_one(
            {"session_id": session_id, "prompt_index": prompt_index},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Conversation entry not found")
        
        return {"success": True, "modified": result.modified_count}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update result: {str(e)}")

@router.put("/update-traces")
async def update_traces(session_id: str, prompt_index: int, traces: List[str]):
    """Update traces for a conversation entry"""
    try:
        result = await conversation_collection.update_one(
            {"session_id": session_id, "prompt_index": prompt_index},
            {
                "$set": {
                    "traces": traces,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        return {"success": True, "modified": result.modified_count}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update traces: {str(e)}")

@router.get("/history/{session_id}", response_model=dict)
async def get_conversation_history(session_id: str):
    """Get complete conversation history for a session"""
    try:
        cursor = conversation_collection.find(
            {"session_id": session_id}
        ).sort("prompt_index", 1)
        
        history = []
        async for entry in cursor:
            # Convert MongoDB document to ConversationEntry model
            entry["_id"] = str(entry["_id"])
            
            # Validate with Pydantic model
            conversation_entry = ConversationEntry(**entry)
            history.append(conversation_entry.model_dump())
        
        return {"success": True, "history": history}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get history: {str(e)}")

@router.delete("/session/{session_id}")
async def delete_session(session_id: str):
    """Delete all conversation entries for a session"""
    try:
        result = await conversation_collection.delete_many({"session_id": session_id})
        return {"success": True, "deleted": result.deleted_count}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete session: {str(e)}")
