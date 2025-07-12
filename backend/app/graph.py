from langgraph.constants import START, END, Send
from langgraph.graph import StateGraph, MessagesState
from langchain_core.messages import AIMessage, HumanMessage, ToolMessage
from langchain_anthropic import ChatAnthropic
from langchain_google_genai import ChatGoogleGenerativeAI
import asyncio
import json

from app.state import State, connected_clients
from app.agents.intent_agent.intent_classifier import IntentClassifier
from app.agents.system_agent.other_response import System
from app.agents.sql_agent.metadata_retriever import get_cached_metadata
from app.agents.sql_agent.sql_query_generator import SQLQueryGenerator
from app.agents.sql_agent.query_executor import execute_query_with_session
from app.agents.visualization_agent.feature_extractor import process_and_clean_dataset
from app.agents.visualization_agent.graph_recommender import get_graph_types, GraphRecommender
from app.agents.analysis_agents.anomaly_detection_agent.pyod_anomaly_detector import (
    detect_anomalies_iforest, detect_anomalies_autoencoder, detect_anomalies_hbos, detect_anomalies_knn, detect_anomalies_lof, detect_anomalies_ocsvm
)
from app.agents.analysis_agents.anomaly_detection_agent.sklearn_anomaly_detector import detect_anomalies_sklearn
from app.agents.analysis_agents.trend_detection_agent.tsfresh_trend_features import tsfresh_feature_extraction
from app.agents.analysis_agents.trend_detection_agent.stumpy_motif_detection import stumpy_pattern_search
from app.agents.analysis_agents.trend_detection_agent.prophet_trend_forecast import prophet_forecast    
from app.utils.decimal_encoder import DecimalEncoder

# claude-3-5-haiku-20241022	
# llm = ChatAnthropic(model="claude-sonnet-4-20250514", max_tokens=2000, temperature=0)
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", max_tokens=2000, temperature=0)

# Augment the LLM with tools
tools = [detect_anomalies_sklearn, 
         detect_anomalies_iforest, 
         detect_anomalies_hbos, 
         detect_anomalies_knn,
         detect_anomalies_autoencoder,
         detect_anomalies_lof,
         detect_anomalies_ocsvm,
         prophet_forecast,
         stumpy_pattern_search,
         tsfresh_feature_extraction]

tools_by_name = {tool.name: tool for tool in tools}
llm_with_tools = llm.bind_tools(tools)

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


# Nodes
async def intent_classifier(state: State):
    """Intent classifier identifies user intents from the query."""
    classifier = IntentClassifier()
    intents = classifier.classify_intent(state.user_prompt)
    print("Intent identification successfull.")
    return state.copy(update={"intents": intents["intent"]})


async def metadata_retriever(state: State):
    """Retrieve metadata from the database."""
    update_message = "Retrieving metadata..."
    messages = state.messages.copy()
    messages.append(update_message)
    if state.session_id in connected_clients:
        await send_websocket_update(state.session_id, update_message)

    metadata = get_cached_metadata(state.session_id)

    return state.copy(update={
        "messages": messages,
        "metadata": metadata
    })


async def sql_generator(state: State):
    """Generates an SQL query for retrieve data from the database."""
    update_message = f"Generating SQL query..."
    messages = state.messages.copy()
    messages.append(update_message)
    if state.session_id in connected_clients:
        await send_websocket_update(state.session_id, update_message)

    sql_query_generator = SQLQueryGenerator()
    db_info = get_cached_metadata(state.session_id)
    metadata = db_info["metadata"]
    sql_dialect = db_info["sql_dialect"]
    sql_query = sql_query_generator.generate_sql_query(state.user_prompt, metadata, sql_dialect)
    response = sql_query
    
    return state.copy(update={
        "messages": messages,
        "metadata": metadata,
        "sql_dialect": sql_dialect,
        "sql_query": sql_query,
        "response": response
    })


async def sql_executor(state: State):
    """Execute the generated SQL query and fetch data from the database."""
    update_message = f"Executing SQL query..."
    messages = state.messages.copy()
    messages.append(update_message)
    if state.session_id in connected_clients:
        await send_websocket_update(state.session_id, update_message)

    original_data = execute_query_with_session(state.session_id, state.sql_query)
    
    return state.copy(update={
        "messages": messages,
        "original_data": original_data
    })

async def data_preprocessor(state: State):
    """Clean, preprocess and rearrange the dataset."""
    update_message = f"Preprocessing data..."
    messages = state.messages.copy()
    messages.append(update_message)
    if state.session_id in connected_clients:
        await send_websocket_update(state.session_id, update_message)

    result = process_and_clean_dataset(state.original_data)
    rearranged_data = result["reordered_dataset"]
    num_numeric = result["num_numeric"]
    num_cat = result["num_cat"]
    num_temporal = result["num_temporal"]
    num_rows = result["num_rows"]
    cardinalities = result["cardinalities"]

    return state.copy(update={
        "messages": messages,
        "rearranged_data": rearranged_data,
        "num_numeric": num_numeric,
        "num_cat": num_cat,
        "num_temporal": num_temporal,
        "num_rows": num_rows,
        "cardinalities": cardinalities
    })

async def graph_ranker(state: State):
    """Rank the graphs based on the data."""
    update_message = f"Ranking suitable graphs..."
    messages = state.messages.copy()
    messages.append(update_message)
    if state.session_id in connected_clients:
        await send_websocket_update(state.session_id, update_message)

    suitable_graphs = get_graph_types(state.num_numeric, state.num_cat, state.num_temporal)
    
    return state.copy(update={
        "messages": messages,
        "suitable_graphs": suitable_graphs
    })

async def insight_generator(state: State):
    """Generate insights using autonomous tool selection based on user prompt and data."""
    update_message = "Analyzing data for insights..."
    messages = state.messages.copy()
    messages.append(update_message)
    if state.session_id in connected_clients:
        await send_websocket_update(state.session_id, update_message)

    # Prepare data context for the LLM
    data_context = {
        "num_rows": state.num_rows,
        "num_numeric": state.num_numeric,
        "num_cat": state.num_cat,
        "num_temporal": state.num_temporal,
        "cardinalities": state.cardinalities
    }
    
    # Create analysis prompt for autonomous tool selection
    analysis_prompt = f"""
    User Request: "{state.user_prompt}"
    
    Dataset Information:
    - Rows: {state.num_rows}
    - Numeric columns: {state.num_numeric}
    - Categorical columns: {state.num_cat}
    - Temporal columns: {state.num_temporal}
    - Cardinalities: {state.cardinalities}
    
    Based on the user's request and dataset characteristics, analyze the data using the most appropriate tools.
    
    Available analysis capabilities:
    - Anomaly detection (multiple algorithms)
    - Time series forecasting with Prophet
    - Pattern/motif detection with STUMPY
    - Feature extraction with TSFresh
    
    Select and use the tools that best address the user's question and dataset type.
    """
    
    # Let LLM autonomously decide which tools to use
    tool_messages = [HumanMessage(content=analysis_prompt)]
    
    try:
        # Get LLM response with tool calls
        response = await llm_with_tools.ainvoke(tool_messages)
        
        insights = []
        tool_results = {}
        
        # Process any tool calls the LLM decided to make
        if hasattr(response, 'tool_calls') and response.tool_calls:
            for tool_call in response.tool_calls:
                tool_name = tool_call["name"]
                tool_args = tool_call["args"]
                
                update_message = f"Executing {tool_name}..."
                if state.session_id in connected_clients:
                    await send_websocket_update(state.session_id, update_message)
                
                # Execute the selected tool
                try:
                    tool_function = tools_by_name[tool_name]
                    print("==================================================")
                    print(f"Tool function:")
                    print(tool_function)
                    print("==================================================")
                    
                    # Prepare arguments with data
                    final_args = {"data": state.rearranged_data}
                    if tool_args:
                        # Only update non-data arguments
                        for key, value in tool_args.items():
                            if key != "data":  # Don't overwrite the data
                                final_args[key] = value
                    
                    print("==================================================")
                    print(f"Rearranged data:")
                    print(state.rearranged_data)
                    print("==================================================")
                    print("==================================================")
                    print(f"Final args:")
                    print(final_args)
                    print("==================================================")
                    # Execute tool
                    result = tool_function.invoke(final_args)
                    print("==================================================")
                    print(f"Tool result:")
                    print(result)
                    print("==================================================")
                    tool_results[tool_name] = result
                    
                    # Generate insight from result
                    insight = await generate_insight_from_tool_result(
                        tool_name, result, state.user_prompt
                    )
                    insights.append(insight)
                    
                except Exception as e:
                    error_msg = f"Error executing {tool_name}: {str(e)}"
                    print(error_msg)
                    insights.append(f"Could not complete {tool_name} analysis: {error_msg}")
        
        # Generate final comprehensive response
        if insights:
            final_response = await synthesize_insights(insights, state.user_prompt)
        else:
            # Fallback if no tools were called
            final_response = await generate_direct_insight(state.user_prompt, data_context)
        
        return state.copy(update={
            "messages": messages,
            "insights": insights,
            "tool_results": tool_results,
            "response": final_response
        })
        
    except Exception as e:
        error_response = f"Error in insight generation: {str(e)}"
        return state.copy(update={
            "messages": messages,
            "response": error_response
        })

async def generate_insight_from_tool_result(tool_name, result, user_prompt):
    """Generate human-readable insight from tool execution result."""
    insight_prompt = f"""
    Tool: {tool_name}
    Result: {result}
    Original Question: "{user_prompt}"
    
    Based on this analysis result, provide a clear, actionable insight that:
    1. Explains what was discovered in simple terms
    2. Relates the finding to the user's original question
    3. Suggests what this means and any recommended actions
    
    Keep the response concise and business-focused.
    """
    
    response = await llm.ainvoke([HumanMessage(content=insight_prompt)])
    print("==================================================")
    print(f"Insight generated from {tool_name}:")
    print(response.content)
    print("==================================================")
    return response.content

async def synthesize_insights(insights, user_prompt):
    """Combine multiple insights into a comprehensive response."""
    synthesis_prompt = f"""
    Original Question: "{user_prompt}"
    
    Analysis Results:
    {chr(10).join([f"• {insight}" for insight in insights])}
    
    Provide a comprehensive summary that:
    1. Directly answers the user's question
    2. Highlights the most important findings
    3. Explains how different insights connect
    4. Provides clear recommendations or next steps
    
    Structure the response clearly and make it actionable.
    """
    
    response = await llm.ainvoke([HumanMessage(content=synthesis_prompt)])
    print("==================================================")
    print(f"Synthesized insights:")
    print(response.content)
    print("==================================================")
    return response.content

async def generate_direct_insight(user_prompt, data_context):
    """Generate insight when no tools were automatically selected."""
    direct_prompt = f"""
    User Question: "{user_prompt}"
    Dataset: {data_context}
    
    Based on the user's question and dataset characteristics, provide helpful guidance on:
    1. What type of analysis would be most appropriate
    2. What insights might be discoverable
    3. Any limitations or considerations
    
    Be specific and actionable in your response.
    """
    
    response = await llm.ainvoke([HumanMessage(content=direct_prompt)])
    print("==================================================")
    print(f"Direct insights:")
    print(response.content)
    print("==================================================")
    return response.content

 

# Need to remove. For testing only.
async def temp_response_generator(state: State):
    recommender = GraphRecommender()
    ranked_graphs = recommender.recommend_graphs(state)
    update_message = f"Ranked graphs: {ranked_graphs}"
    messages = state.messages.copy()
    messages.append(update_message)
    if state.session_id in connected_clients:
        print(f"Sending WebSocket message: {update_message}")
        await send_websocket_update(state.session_id, update_message)

    state = state.copy(update={
        "messages": messages,
        "ranked_graphs": ranked_graphs
    })
    response = (f"Original dataset: {state.original_data[0]}\n\n"
                    f"Rearranged dataset: {state.rearranged_data[0]}\n\n"
                    f"Suitable graph types: {state.suitable_graphs}\n\n"
                    f"Recommended graph types: {state.ranked_graphs}\n\n"
                    f"Insights: {state.insights}\n\n"
                    f"Tool results: {state.tool_results}\n\n")

    return state.copy(update={"response": response})


async def response_generator(state: State):
    """Generate responses if intent classifier identifies intent as 'other'."""
    system = System()
    response = system.other_response(state)
    print(response)
    
    return state.copy(update={"response": response})


async def route_intent(state: State):
    if "metadata" in state.intents:
        return "metadata"
    elif "visualization" in state.intents:
        return "visualization"
    elif "insight" in state.intents:
        return "insight"
    elif "other" in state.intents:
        return "other"


builder = StateGraph(State)
builder.add_node("intent_classifier", intent_classifier)
builder.add_node("metadata_retriever", metadata_retriever)
builder.add_node("sql_generator", sql_generator)
builder.add_node("sql_executor", sql_executor)
builder.add_node("data_preprocessor", data_preprocessor)
builder.add_node("graph_ranker", graph_ranker)
builder.add_node("insight_generator", insight_generator)
builder.add_node("response_generator", response_generator)
builder.add_node("temp_response_generator", temp_response_generator)


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
builder.add_edge("graph_ranker", "insight_generator")
builder.add_edge("insight_generator", "temp_response_generator")
builder.add_edge("temp_response_generator", END)
builder.add_edge("response_generator", END)

workflow = builder.compile()