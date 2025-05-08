from fastapi import WebSocket, WebSocketDisconnect, APIRouter, HTTPException
import json

from app.graph import State, workflow
from app.utils.logging import logger

router = APIRouter()

connected_clients = []

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    try:
        while True:
            text_data = await websocket.receive_text()
            data = json.loads(text_data)
            user_prompt = data["user_prompt"]
            session_id = data["session_id"]
            print(f"User prompt: {user_prompt}\n\nSession ID: {session_id}")
            print(f"Message received: {data}")
            try:
                state = State(
                    session_id=session_id,
                    user_prompt=user_prompt,
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
                print(f"Workflow result: {result}")
                
                # return {
                #     "message": "Prompt processed successfully!",
                #     "result": result
                # }
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))
            
            for client in connected_clients:
                returned_data = json.dumps({
                    "message": "Prompt processed successfully!",
                    "result": result
                })
                await client.send_text(returned_data)
                print(f"Message sent to client: {returned_data}")
    except WebSocketDisconnect:
        connected_clients.remove(websocket)
