from langgraph.constants import START, END, Send
from langgraph.graph import StateGraph
from langchain_core.messages import AIMessage, HumanMessage
import asyncio
import json

from app.state import State
from app.agents.intent_agent.intent_classifier import IntentClassifier
from app.agents.system_agent.other_response import System
from app.agents.sql_agent.metadata_retriever import get_cached_metadata
from app.agents.sql_agent.sql_query_generator import SQLQueryGenerator
from app.agents.sql_agent.query_executor import execute_query_with_session
from app.agents.visualization_agent.feature_extractor import process_and_clean_dataset, get_graph_types
from app.state import connected_clients

# Helper function for sending WebSocket updates
async def send_websocket_update(session_id, message):
    if session_id in connected_clients:
        websocket = connected_clients[session_id]
        try:
            await websocket.send_text(json.dumps({
                "type": "update",
                "message": message,
                "result": {"response": message}
            }))
        except Exception as e:
            print(f"Error sending WebSocket update: {e}")

# Nodes
async def intent_classifier(state: State):
    """Intent classifier identifies user intents from the query."""
    classifier = IntentClassifier()
    intents = classifier.classify_intent(state.user_prompt)
    state.intents = intents["intent"]
    print("Intent identification successfull.")
    if not hasattr(state, "messages") or state.messages is None:
        state.messages = [state.user_prompt]
    
    update_message = f"Intent identified: {intents['intent']}"
    state.messages.append(update_message)
    
    if state.session_id in connected_clients:
        asyncio.create_task(send_websocket_update(state.session_id, update_message))
    
    return state

async def metadata_retriever(state: State):
    """Retrieve metadata from the database."""
    state.metadata = get_cached_metadata(state.session_id)
    update_message = f"Metadata Retrieved"
    state.messages.append(update_message)
    
    if state.session_id in connected_clients:
        asyncio.create_task(send_websocket_update(state.session_id, update_message))
    
    return state

async def sql_generator(state: State):
    """Generates an SQL query for retrieve data from the database."""
    sql_query_generator = SQLQueryGenerator()
    db_info = get_cached_metadata(state.session_id)
    state.metadata = db_info["metadata"]
    state.sql_dialect = db_info["sql_dialect"]
    sql_query = sql_query_generator.generate_sql_query(state.user_prompt, state.metadata, state.sql_dialect)
    state.sql_query = sql_query
    state.response = sql_query
    update_message = f"SQL query generated: {sql_query}"
    state.messages.append(update_message)
    
    if state.session_id in connected_clients:
        asyncio.create_task(send_websocket_update(state.session_id, update_message))
    
    return state

async def sql_executor(state: State):
    """Execute the generated SQL query and fetch data from the database."""
    state.data = execute_query_with_session(state.session_id, state.sql_query)
    state.response = f"SQL Query Generated\n\nData Retrieved from Database"
    update_message = f"SQL query executed: {state.data}"
    state.messages.append(update_message)
    
    if state.session_id in connected_clients:
        asyncio.create_task(send_websocket_update(state.session_id, update_message))
    
    return state

async def data_preprocessor(state: State):
    """Clean, preprocess and rearrange the dataset."""
    result = process_and_clean_dataset(state.data)
    state.data = result["reordered_dataset"]
    state.num_numeric = result["num_numeric"]
    state.num_cat = result["num_cat"]
    state.num_temporal = result["num_temporal"]
    state.num_rows = result["num_rows"]
    state.cardinalities = result["cardinalities"]

    update_message = f"Data preprocessed successfully."
    state.messages.append(update_message)
    
    if state.session_id in connected_clients:
        asyncio.create_task(send_websocket_update(state.session_id, update_message))

    return state

async def graph_ranker(state: State):
    """Rank the graphs based on the data."""
    # Placeholder for graph ranking logic
    suitable_graphs = get_graph_types(state.num_numeric, state.num_cat, state.num_temporal)
    state.ranked_graphs = suitable_graphs  # placeholder until actual ranking implementation
    update_message = f"Graph ranking successfull. Ranked graphs: {suitable_graphs}"
    state.messages.append(update_message)
    
    if state.session_id in connected_clients:
        asyncio.create_task(send_websocket_update(state.session_id, update_message))

    return state

async def response_generator(state: State):
    """Generate responses if intent classifier identifies intent as 'other'."""
    system = System()
    response = system.other_response(state)
    state.response = response
    print(response)
    update_message = f"Response generated: {response}"
    state.messages.append(update_message)
    
    if state.session_id in connected_clients:
        asyncio.create_task(send_websocket_update(state.session_id, update_message))
    
    return state

# def trend_detector():
#     """Detect trends in data."""
#     print("Trend detections successfull.")

# def correlation_analyzer():
#     """Analyze correlation in data."""
#     print("Correlation analysis successfull.")

# def anomaly_detector():
#     """Detect anomalies in data."""
#     print("Anomaly detection successfull.")

# def assign_analyzers():
#     """Trigger the analyzers to run in parallel"""
#     print("Trigger analyzers successfull.")
#     return [
#         Send("trend_detector"),
#         Send("correlation_analyzer"),
#         Send("anomaly_detector")
#     ]

# def insight_generator():
#     """Generate insights from identifies trends, anomalies or correlations."""
#     print("Insight generation successfull.")

# def context_integrator():
#     """Access external data from APIs."""
#     print("Context integration successfull.")

# def explanation_generator():
#     """Generate explanations for the identified anomalies, trends or correlations."""
#     print("Explanation generation successfull.")

# def graph_recommender(state: State) -> State:
#     """Recommends suitable graph types for visualize data."""
#     model = GraphModel()
#     prediction = model.predict(state.features)
#     state.graph_types = prediction["predicted_graph"]
#     print(f"Recommended graph types: {state.graph_types}")
#     return state

# def graph_generator():
#     """Generate the graph for visualize data."""
#     print("Graph generation successfull.")


async def route_intent(state: State):
    if "metadata" in state.intents:
        return "metadata"
    elif "visualization" in state.intents:
        return "visualization"
    elif "insight" in state.intents:
        return "insight"
    elif "other" in state.intents:
        return "other"

#Build workflow
# sql_agent = StateGraph(State)
# sql_agent.add_node("sql_generator", sql_generator)
# sql_agent.add_node("data_fetcher", data_fetcher)

# sql_agent.add_edge(START, "sql_generator")
# sql_agent.add_edge("sql_generator", "data_fetcher")

# analysis_agent = StateGraph(State)
# analysis_agent.add_node("trend_detector", trend_detector)
# analysis_agent.add_node("correlation_analyzer", correlation_analyzer)
# analysis_agent.add_node("anomaly_detector", anomaly_detector)
# analysis_agent.add_node("insight_generator", insight_generator)

# analysis_agent.add_conditional_edges(
#     START,
#     assign_analyzers,
#     ["trend_detector", "correlation_analyzer", "anomaly_detector"]
# )
# analysis_agent.add_edge("trend_detector", "insight_generator")
# analysis_agent.add_edge("correlation_analyzer", "insight_generator")
# analysis_agent.add_edge("anomaly_detector", "insight_generator")

# explanation_agent = StateGraph(State)
# explanation_agent.add_node("context_integrator", context_integrator)
# explanation_agent.add_node("explanation_generator", explanation_generator)

# explanation_agent.add_edge(START, "context_integrator")
# explanation_agent.add_edge("context_integrator", "explanation_generator")

# visualization_agent = StateGraph(State)
# visualization_agent.add_node("graph_recommender", graph_recommender)
# visualization_agent.add_node("graph_generator", graph_generator)

# visualization_agent.add_edge(START, "graph_recommender")
# visualization_agent.add_edge("graph_recommender", "graph_generator")

builder = StateGraph(State)
builder.add_node("intent_classifier", intent_classifier)
builder.add_node("metadata_retriever", metadata_retriever)
builder.add_node("sql_generator", sql_generator)
builder.add_node("sql_executor", sql_executor)
builder.add_node("data_preprocessor", data_preprocessor)
builder.add_node("graph_ranker", graph_ranker)
builder.add_node("response_generator", response_generator)

# builder.add_node("sql_agent", sql_agent.compile())
# builder.add_node("analysis_agent", analysis_agent.compile())
# builder.add_node("explanation_agent", explanation_agent.compile())
# builder.add_node("visualization_agent", visualization_agent.compile())
# builder.add_node("synthesizer", synthesizer)

builder.add_edge(START, "intent_classifier")
builder.add_conditional_edges(
    "intent_classifier",
    route_intent, 
    {   # Name returned by route_intent : Name of next node to visit
        "metadata": "metadata_retriever",
        "visualization": "sql_generator",
        "insight": "sql_generator",
        "other": "response_generator",
    },
)
builder.add_edge("metadata_retriever", "response_generator")
builder.add_edge("sql_generator", "sql_executor")
builder.add_edge("sql_executor", "data_preprocessor")
builder.add_edge("data_preprocessor", "graph_ranker")
builder.add_edge("graph_ranker", END)
builder.add_edge("response_generator", END)
# builder.add_edge("intent_classifier", "sql_agent")
# builder.add_edge("sql_agent", "analysis_agent")
# builder.add_edge("analysis_agent", "explanation_agent")
# builder.add_edge("explanation_agent", "visualization_agent")
# builder.add_edge("visualization_agent", "synthesizer")
# builder.add_edge("synthesizer", END)

workflow = builder.compile()