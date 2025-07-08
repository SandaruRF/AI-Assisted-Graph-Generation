from fastapi import WebSocket, WebSocketDisconnect, APIRouter, HTTPException
import json
import uuid

from app.graph import State, workflow
from app.utils.logging import logger
from app.utils.decimal_encoder import DecimalEncoder
from app.state import connected_clients, graph_state_manager
from app.agents.visualization_agent.ui_customizer import (
    parse_customization_prompt, 
    is_customization_prompt, 
    generate_customization_response
)

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    session_id = None
    print("WebSocket connection established")
    try:
        while True:
            text_data = await websocket.receive_text()
            data = json.loads(text_data)
            user_prompt = data.get("user_prompt", "")
            session_id = data.get("session_id", str(uuid.uuid4()))  # Generate session_id if not provided
            print(f"User prompt: {user_prompt}\n\nSession ID: {session_id}")
            
            # Store the websocket connection
            connected_clients[session_id] = websocket
            
            # Check if this is a customization prompt
            if is_customization_prompt(user_prompt):
                await websocket.send_text(json.dumps({
                    "type": "update",
                    "message": "Processing customization request..."
                }, cls=DecimalEncoder))
                
                try:
                    # Get current state
                    current_state = graph_state_manager.get_state(session_id)
                    
                    # Parse customization updates
                    updates = parse_customization_prompt(user_prompt)
                    
                    # Update the state
                    new_state = graph_state_manager.update_state(updates, session_id)
                    
                    # Generate response message
                    response_message = generate_customization_response(updates, current_state)
                    
                    # Create result object for frontend
                    customization_result = {
                        "response": response_message,
                        "is_customization": True,
                        "graph_state": new_state,
                        "num_numeric": current_state.get("num_numeric", 0),
                        "num_cat": current_state.get("num_cat", 0),
                        "num_temporal": current_state.get("num_temporal", 0),
                        "ranked_graphs": [new_state.get("graph_type", "line")],
                        "rearranged_data": current_state.get("data", [])
                    }
                    
                    # Send final result
                    await websocket.send_text(json.dumps({
                        "type": "final",
                        "message": "Customization applied successfully!",
                        "result": customization_result,
                    }, cls=DecimalEncoder))
                    
                except Exception as e:
                    error_message = str(e)
                    await websocket.send_text(json.dumps({
                        "type": "error",
                        "message": f"Customization error: {error_message}"
                    }, cls=DecimalEncoder))
                    logger.error(f"Error processing customization: {error_message}")
                    
            else:
                # Original graph generation workflow
                await websocket.send_text(json.dumps({
                    "type": "update",
                    "message": "Classifying user intent..."
                }, cls=DecimalEncoder))
                
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
                        messages=[]
                    )
                    
                    result = await workflow.ainvoke(state)  # Get final state
                    
                    print(f"Result type: {type(result)}")
                    print(f"Result class: {result.__class__.__name__}")
                    print(f"Result attributes: {dir(result)}")
                    print(f"Result keys (if dict-like): {list(result.keys()) if hasattr(result, 'keys') else 'No keys method'}")
                    
                    # Convert result to dict - handle both Pydantic models and AddableValuesDict
                    try:
                        if hasattr(result, 'model_dump'):
                            result_dict = result.model_dump()
                        elif hasattr(result, 'dict'):
                            result_dict = result.dict()
                        else:
                            # If it's already a dict-like object, convert to regular dict
                            result_dict = dict(result)
                    except Exception as e:
                        print(f"Error converting result to dict: {e}")
                        # Fallback: try to access as attributes
                        result_dict = {}
                        for key in ['session_id', 'user_prompt', 'intents', 'metadata', 'sql_query', 
                                   'sql_dialect', 'original_data', 'rearranged_data', 'num_numeric', 
                                   'num_cat', 'num_temporal', 'num_rows', 'cardinalities', 
                                   'suitable_graphs', 'ranked_graphs', 'response', 'messages']:
                            try:
                                if hasattr(result, key):
                                    result_dict[key] = getattr(result, key)
                            except:
                                pass
                    
                    print(f"Result dict keys: {result_dict.keys()}")
                    print(f"Rearranged data: {result_dict.get('rearranged_data')}")
                    
                    # Store the generated graph data in state manager
                    if result_dict.get('rearranged_data'):
                        graph_state_manager.set_graph_data(
                            result_dict['rearranged_data'], 
                            session_id
                        )
                        # Update graph state with generated data
                        graph_state_manager.update_state({
                            "num_numeric": result_dict.get('num_numeric', 0),
                            "num_cat": result_dict.get('num_cat', 0),
                            "num_temporal": result_dict.get('num_temporal', 0),
                            "ranked_graphs": result_dict.get('ranked_graphs', []),
                            "graph_type": result_dict.get('ranked_graphs', ['line'])[0] if result_dict.get('ranked_graphs') else "line"
                        }, session_id)
                    
                    # Send final result
                    await websocket.send_text(json.dumps({
                        "type": "final",
                        "message": "Prompt processed successfully!",
                        "result": result_dict,
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