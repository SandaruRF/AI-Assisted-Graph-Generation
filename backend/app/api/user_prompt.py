from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from graph import orchestrator_worker, UserPromptState

router = APIRouter()

class UserPrompt(BaseModel):
    user_prompt: str

@router.post("/send-user-prompt")
async def process_user_prompt(user_prompt: UserPrompt):
    try:
        state = UserPromptState(user_prompt=user_prompt.user_prompt, intents=[], response="")
        
        result = orchestrator_worker.invoke(state)
        
        return {
            "message": "Prompt processed successfully!",
            "result": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))