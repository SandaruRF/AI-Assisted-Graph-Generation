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
                
                frontend_payload = {
                    "type": "final",
                    "message": "Prompt processed successfully!",
                    "result": {
                        "session_id": result["session_id"],
                        "user_prompt": result["user_prompt"],
                        "intents": result["intents"],
                        "sql_query": result["sql_query"],
                        "sql_dialect": result["sql_dialect"],
                        "rearranged_data": result["rearranged_data"],
                        "num_numeric": result["num_numeric"],
                        "num_cat": result["num_cat"],
                        "num_temporal": result["num_temporal"],
                        "num_rows": result["num_rows"],
                        "cardinalities": result["cardinalities"],
                        "suitable_graphs": result["suitable_graphs"],
                        "ranked_graphs": result["ranked_graphs"],
                        "response": result["response"],
                        "messages": result["messages"],
                        "insights": result["insights"],
                        "tool_results": result["tool_results"],
                        "insights_response": result["insights_response"],
                        "search_plan": result["search_plan"],
                        "search_results": result["search_results"],
                        "explanation": result["explanation"]
                    }
                }

                with open("frontend_payload.json", "w", encoding="utf-8") as f:
                    json.dump(frontend_payload, f, indent=2, cls=DecimalEncoder)
                # Send final result
                await websocket.send_text(json.dumps(frontend_payload, cls=DecimalEncoder))
                
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
