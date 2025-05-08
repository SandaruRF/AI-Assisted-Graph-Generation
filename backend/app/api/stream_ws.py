# from fastapi import WebSocket, WebSocketDisconnect
# from langchain_core.messages import BaseMessage, HumanMessage
# import logging

# from app.graph import workflow
# from app.state import State

# logger = logging.getLogger(__name__)
# active_connections = {}

# def serialize_message(message: BaseMessage) -> dict:
#     return {
#         "type": message.type,
#         "content": message.content,
#         "additional_kwargs": message.additional_kwargs,
#         "example": message.example,
#     }

# async def stream_response(websocket: WebSocket, session_id: str):
#     active_connections[session_id] = websocket
#     logger.info(f"Starting stream for session: {session_id}")

#     try:
#         while True:
#             input_data = await websocket.receive_json()
#             logger.info(f"Received data for session {session_id}: {input_data}")

#             input_state = State(
#                 user_prompt=input_data["prompt"],
#                 session_id=input_data["session_id"],
#                 intents=[],
#                 metadata=[],
#                 sql_query="",
#                 sql_dialect="",
#                 data=[],
#                 response="",
#                 messages=[HumanMessage(content=input_data["prompt"])]
#             )

#             # Stream the workflow execution
#             async for step in workflow.astream(input_state):
#                 if hasattr(step, "messages"):
#                     messages = step.messages
#                     serialized_messages = [serialize_message(m) for m in messages]
#                     logger.info(f"Sending messages for session {session_id}: {serialized_messages}")
#                     await websocket.send_json({"messages": serialized_messages})

#     except WebSocketDisconnect:
#         logger.info(f"WebSocket disconnected: {session_id}")
#     except Exception as e:
#         logger.error(f"Error in WebSocket stream: {str(e)}")
#         raise
#     finally:
#         if session_id in active_connections:
#             del active_connections[session_id]
#             logger.info(f"Cleaned up connection for session: {session_id}")
