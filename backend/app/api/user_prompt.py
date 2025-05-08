from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.graph import workflow, State
from app.utils.logging import logger

router = APIRouter()

class UserPrompt(BaseModel):
    session_id: str
    user_prompt: str

@router.post("/send-user-prompt")
async def process_user_prompt(user_prompt: UserPrompt):
    try:
        state = State(
            session_id=user_prompt.session_id,
            user_prompt=user_prompt.user_prompt,
            intents=[],
            metadata=[],
            sql_query="",
            sql_dialect="",
            data=[],
            response="",
            messages=[]
        )
        
        result = workflow.invoke(state)
        logger.info("Workflow result: %s", result)
        
        return {
            "message": "Prompt processed successfully!",
            "result": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))