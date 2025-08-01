from fastapi import WebSocket, WebSocketDisconnect, APIRouter, HTTPException
import json
import uuid
import traceback

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
            print(f"Received text data: {text_data}")
            data = json.loads(text_data)
            user_prompt = data.get("user_prompt", "")
            session_id = data.get("session_id", str(uuid.uuid4()))  # Generate session_id if not provided
            print(f"User prompt: {user_prompt}\n\nSession ID: {session_id}")
            
            # Store the websocket connection
            connected_clients[session_id] = websocket
            
            # Check if this is a customization prompt
            is_custom = is_customization_prompt(user_prompt)
            print(f"Is customization prompt: {is_custom}")
            
            if is_custom:
                # Handle customization
                await websocket.send_text(json.dumps({
                    "type": "update",
                    "message": "Processing customization request..."
                }, cls=DecimalEncoder))
                
                try:
                    print("Processing customization request...")
                    # Get the current prompt index (length of existing history)
                    current_prompt_index = len(graph_state_manager.get_history(session_id))
                    print(f"Current prompt index: {current_prompt_index}")
                    
                    # Get the last graph state to base customization on
                    last_graph_state = graph_state_manager.get_state(session_id)
                    print(f"Last graph state: {last_graph_state}")
                    
                    if not last_graph_state or not last_graph_state.get("data"):
                        print("No previous graph found to customize")
                        await websocket.send_text(json.dumps({
                            "type": "error",
                            "message": "No previous graph found to customize. Please generate a graph first."
                        }, cls=DecimalEncoder))
                        continue
                    
                    # Parse customization updates
                    updates = parse_customization_prompt(user_prompt)
                    print(f"Parsed updates: {updates}")
                    print(f"User prompt: {user_prompt}")
                    print(f"Updates keys: {list(updates.keys())}")
                    if "x_label" in updates:
                        print(f"X-label update found: {updates['x_label']}")
                    if "y_label" in updates:
                        print(f"Y-label update found: {updates['y_label']}")
                    if "title" in updates:
                        print(f"Title update found: {updates['title']}")
                    
                    # Create a new customized graph state based on the last one
                    try:
                        new_graph_state = graph_state_manager.add_customized_graph(
                            last_graph_state, 
                            updates, 
                            session_id, 
                            current_prompt_index
                        )
                        print(f"New graph state created: {new_graph_state}")
                    except Exception as e:
                        print(f"Error in add_customized_graph: {e}")
                        raise
                    
                    # Generate response message
                    response_message = generate_customization_response(updates, last_graph_state)
                    print(f"Response message: {response_message}")
                    
                    # Create result object for frontend
                    customization_result = {
                        "response": response_message,
                        "is_customization": True,
                        "graph_state": new_graph_state,
                        "prompt_index": current_prompt_index,
                        "num_numeric": new_graph_state.get("num_numeric", 0),
                        "num_cat": new_graph_state.get("num_cat", 0),
                        "num_temporal": new_graph_state.get("num_temporal", 0),
                        "ranked_graphs": [new_graph_state.get("graph_type", "line")],
                        "rearranged_data": new_graph_state.get("data", [])
                    }
                    print(f"Customization result: {customization_result}")
                    
                    # Send final result
                    try:
                        final_message = {
                            "type": "final",
                            "message": "Customization applied successfully!",
                            "result": customization_result,
                        }
                        print(f"Sending final message: {final_message}")
                        await websocket.send_text(json.dumps(final_message, cls=DecimalEncoder))
                        print("Final message sent successfully")
                    except Exception as e:
                        print(f"Error sending final message: {e}")
                        raise
                    
                except Exception as e:
                    error_message = str(e)
                    await websocket.send_text(json.dumps({
                        "type": "error",
                        "message": f"Customization error: {error_message}"
                    }, cls=DecimalEncoder))
                    logger.error("Error processing customization: %s\n%s", error_message, traceback.format_exc())
                    
            else:
                # Original graph generation workflow
                await websocket.send_text(json.dumps({
                    "type": "update",
                    "message": "Classifying user intent..."
                }, cls=DecimalEncoder))
                
                try:
                    # Get the current prompt index
                    current_prompt_index = len(graph_state_manager.get_history(session_id))
                    
                    # Initialize state
                    state = State(
                        session_id=session_id,
                        user_prompt=user_prompt,
                        suggestions=[],
                        intents=[],
                        metadata={},
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
                        ranked_graphs={},
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
                                   'suitable_graphs', 'ranked_graphs', 'response', 'messages',
                                   'insights', 'tool_results', 'insights_response', 'search_plan',
                                   'search_results', 'explanation']:
                            try:
                                if hasattr(result, key):
                                    result_dict[key] = getattr(result, key)
                            except:
                                pass
                    
                    print(f"Result dict keys: {result_dict.keys()}")
                    print(f"Rearranged data: {result_dict.get('rearranged_data')}")
                    
                    # Create a new graph state for this prompt
                    if result_dict.get('rearranged_data'):
                        new_graph_state = {
                            "graph_type": result_dict.get('ranked_graphs', {}).get('recommended_graphs', ['line'])[0] if result_dict.get('ranked_graphs', {}).get('recommended_graphs') else "line",
                            "x_label": "X Axis",
                            "y_label": "Y Axis",
                            "legend_label": "Legend",
                            "title": "Generated Graph",
                            "color": "#3366cc",
                            "data": result_dict['rearranged_data'],
                            "num_numeric": result_dict.get('num_numeric', 0),
                            "num_cat": result_dict.get('num_cat', 0),
                            "num_temporal": result_dict.get('num_temporal', 0),
                            "ranked_graphs": result_dict.get('ranked_graphs', []),
                            "session_id": session_id,
                            "prompt_index": current_prompt_index,
                            "is_customization": False
                        }
                        
                        # Add the new graph state to history
                        graph_state_manager.add_new_graph(new_graph_state, session_id, current_prompt_index)
                    
                    # Create frontend payload (from dev branch)
                    frontend_payload = {
                        "type": "final",
                        "message": "Prompt processed successfully!",
                        "result": {
                            **result_dict,
                            "prompt_index": current_prompt_index
                        }
                    }

                    # Save debug files (from dev branch)
                    with open("frontend_payload.json", "w", encoding="utf-8") as f:
                        json.dump(frontend_payload, f, indent=2, cls=DecimalEncoder)
                    with open("backend_results.json", "w", encoding="utf-8") as f:
                        json.dump(result_dict, f, indent=2, cls=DecimalEncoder)
                    
                    # Send final result
                    await websocket.send_text(json.dumps(frontend_payload, cls=DecimalEncoder))
                    
                except Exception as e:
                    error_message = str(e)
                    await websocket.send_text(json.dumps({
                        "type": "error",
                        "message": error_message
                    }, cls=DecimalEncoder))
                    logger.error("Error processing request: %s\n%s", error_message, traceback.format_exc())
                
    except WebSocketDisconnect:
        if session_id and session_id in connected_clients:
            del connected_clients[session_id]
            print(f"Client {session_id} disconnected.")
