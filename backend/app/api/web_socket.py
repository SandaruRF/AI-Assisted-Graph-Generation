from fastapi import WebSocket, WebSocketDisconnect, APIRouter, HTTPException
import json

from app.graph import State, workflow
from app.utils.logging import logger
from app.utils.decimal_encoder import DecimalEncoder
from app.state import connected_clients

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    session_id = None
    try:
        while True:
            text_data = await websocket.receive_text()
            data = json.loads(text_data)
            await websocket.send_text(json.dumps({
                    "type": "update",
                    "message": "Classifying user intent..."
                }, cls=DecimalEncoder))
            user_prompt = data["user_prompt"]
            session_id = data["session_id"]
            print(f"User prompt: {user_prompt}\n\nSession ID: {session_id}")
            
            # Store the websocket connection
            connected_clients[session_id] = websocket
            
            try:
                # Initialize state
                state = State(
                    session_id=session_id,
                    user_prompt=user_prompt,
                    intents=[],
                    metadata=[],
                    sql_query="",
                    sql_dialect="",
                    original_data=[],
                    rearranged_data=[],
                    num_numeric=0,
                    num_cat=0,
                    num_temporal=0,
                    num_rows=0,
                    cardinalities={},
                    suitable_graphs=[],
                    ranked_graphs=[],
                    response="",
                    messages=[],
                    insights=[],
                    tool_results={},
                    insights_response="",
                    search_plan={},
                    search_results={},
                    explanation=""
                )
                
                result = await workflow.ainvoke(state)  # Get final state
                
                # Send final result
                await websocket.send_text(json.dumps({
                    "type": "final",
                    "message": "Prompt processed successfully!",
                    "result": result,
                }, cls=DecimalEncoder))
                
            except Exception as e:
                error_message = str(e)
                await websocket.send_text(json.dumps({
                    "type": "error",
                    "message": error_message
                }, cls=DecimalEncoder))
                logger.error(f"Error processing request: {error_message}")
                
    except WebSocketDisconnect:
        if session_id and session_id in connected_clients:
            del connected_clients[session_id]
            print(f"Client {session_id} disconnected.")
