from fastapi import APIRouter, Depends
from app.utils.auth import get_current_user                      
from app.agents.visualization_agent.ranking import get_ranked_graphs_for_user

router = APIRouter()

@router.get("/ranked-graphs", tags=["Graph Rankings"])
def ranked_graphs(email: str = Depends(get_current_user)):
    ranked = get_ranked_graphs_for_user(email)
    return {"ranked_graphs": ranked}
