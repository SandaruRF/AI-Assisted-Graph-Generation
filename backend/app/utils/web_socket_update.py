import json

from app.state import connected_clients
from app.utils.decimal_encoder import DecimalEncoder

# Helper function for sending WebSocket updates
async def send_websocket_update(session_id, message):
    if session_id in connected_clients:
        websocket = connected_clients[session_id]
        try:
            await websocket.send_text(json.dumps({
                "type": "update",
                "message": message,
                "result": {"response": message}
            }, cls=DecimalEncoder))
        except Exception as e:
            print(f"Error sending WebSocket update: {e}")