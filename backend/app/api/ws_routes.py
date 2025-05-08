# from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
# from app.api.stream_ws import stream_response
# import logging
# import traceback

# logger = logging.getLogger(__name__)
# router = APIRouter()

# @router.websocket("/stream/{session_id}")
# async def websocket_stream(websocket: WebSocket, session_id: str):
#     logger.info(f"New WebSocket connection request for session: {session_id}")
#     try:
#         # Accept the connection first
#         await websocket.accept()
#         logger.info(f"WebSocket connection accepted for session: {session_id}")
        
#         # Then start the stream
#         await stream_response(websocket, session_id)
#     except WebSocketDisconnect:
#         logger.info(f"WebSocket disconnected for session: {session_id}")
#     except Exception as e:
#         logger.error(f"Error in WebSocket stream for session {session_id}: {str(e)}")
#         logger.error(f"Traceback: {traceback.format_exc()}")
#         try:
#             await websocket.close(code=1011, reason=str(e))
#         except:
#             pass
#         raise HTTPException(status_code=500, detail=str(e))