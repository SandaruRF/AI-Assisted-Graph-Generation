from fastapi import WebSocket, WebSocketDisconnect, APIRouter

from app.graph import State

router = APIRouter()

connected_clients = []

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            print(f"Message received: {data}")
            for client in connected_clients:
                returned_data = "I am grook"
                await client.send_text(returned_data)
                print(f"Message sent to client: {returned_data}")
    except WebSocketDisconnect:
        connected_clients.remove(websocket)
