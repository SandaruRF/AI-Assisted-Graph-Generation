from langgraph.constants import START, END
from langgraph.graph import StateGraph

from app.state import State, connected_clients
from app.utils.web_socket_update import send_websocket_update
from app.utils.response_formatters import (
    generate_metadata_response,
    generate_system_response, 
    generate_customization_response,
    generate_analysis_response
)
from app.agents.intent_agent.intent_classifier import IntentClassifier
from app.agents.system_agent.other_response import System
from app.agents.system_agent.metadata_response import MetadataExpert
from app.agents.sql_agent.metadata_retriever import get_cached_metadata
from app.agents.sql_agent.sql_query_generator import SQLQueryGenerator
from app.agents.sql_agent.query_executor import execute_query_with_session
from app.agents.visualization_agent.feature_extractor import process_and_clean_dataset
from app.agents.visualization_agent.graph_recommender import get_graph_types, GraphRecommender
from app.agents.explanation_agent.insight_generator import generate_insights
from app.agents.explanation_agent.query_generator import InsightExplanationQueryGenerator
from app.agents.explanation_agent.search_execution_engine import SearchExecutor
from app.agents.explanation_agent.explanation_generator import generate_insight_explanation

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
        "metadata": metadata.get("metadata", {}),
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
    
    return state.copy(update={
        "messages": messages,
        "metadata": metadata,
        "sql_dialect": sql_dialect,
        "sql_query": sql_query
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
    recommender = GraphRecommender()
    ranked_graphs = recommender.recommend_graphs(state, suitable_graphs)

    return state.copy(update={
        "messages": messages,
        "suitable_graphs": suitable_graphs,
        "ranked_graphs": ranked_graphs
    })


async def insight_generator(state: State):
    """Generate insights using autonomous tool selection based on user prompt and data."""
    update_message = "Analyzing data for insights..."
    messages = state.messages.copy()
    messages.append(update_message)
    if state.session_id in connected_clients:
        await send_websocket_update(state.session_id, update_message)

    # Call generate_insights and extract results
    insights_state = await generate_insights(state)
    
    return state.copy(update={
        "messages": insights_state.messages,
        "insights": insights_state.insights,
        "tool_results": insights_state.tool_results,
        "insights_response": insights_state.insights_response
    })


async def explanation_generator(state: State):
    """Generate explanations for discovered insights with external context."""
    update_message = "Planning search strategy for insight explanations..."
    messages = state.messages.copy()
    messages.append(update_message)
    
    if state.session_id in connected_clients:
        await send_websocket_update(state.session_id, update_message)
    
    # Initialize insight-focused search generator
    search_generator = InsightExplanationQueryGenerator()
    
    # Generate search plan based on insights and database context
    search_plan = await search_generator.generate_explanation_search_plan(
        user_query=state.user_prompt,
        insights=state.insights,
        metadata=state.metadata,
        tool_results=state.tool_results
    )
    
    # Execute searches
    update_message = "Searching for explanatory context..."
    messages.append(update_message)
    if state.session_id in connected_clients:
        await send_websocket_update(state.session_id, update_message)
    
    search_executor = SearchExecutor()
    search_results = await search_executor.execute_search_plan(search_plan)
    
    # Generate final explanation
    update_message = "Generating comprehensive explanations..."
    messages.append(update_message)
    if state.session_id in connected_clients:
        await send_websocket_update(state.session_id, update_message)
    
    explanation = await generate_insight_explanation(
        user_query=state.user_prompt,
        insights=state.insights,
        search_results=search_results,
        metadata=state.metadata,
        tool_results=state.tool_results
    )
    
    return state.copy(update={
        "messages": messages,
        "search_plan": search_plan,
        "search_results": search_results,
        "explanation": explanation
    })


async def customizer(state: State):
    """Customize the generated graph based on user prompts."""
    update_message = "Customizing the graph..."
    messages = state.messages.copy()
    messages.append(update_message)
    if state.session_id in connected_clients:
        await send_websocket_update(state.session_id, update_message)
    
    return state.copy(update={
        "messages": messages
    })


async def system(state: State):
    """Handle system-level operations like connecting to a different database or exporting the graph."""
    update_message = "Handling system operations..."
    messages = state.messages.copy()
    messages.append(update_message)
    if state.session_id in connected_clients:
        await send_websocket_update(state.session_id, update_message)
    
    return state.copy(update={
        "messages": messages
    })
 

async def response_generator(state: State):
    """Generate the final response based on detected intents."""
    update_message = "Generating final response..."
    messages = state.messages.copy()
    messages.append(update_message)
    if state.session_id in connected_clients:
        print(f"Sending WebSocket message: {update_message}")
        await send_websocket_update(state.session_id, update_message)

    intents = state.intents
    response = ""
    
    # Handle different intent combinations
    if "other" in intents:
        # Handle 'other' intent (previously temp_response_generator)
        system = System()
        response = system.other_response(state)
        
    elif "schema" in intents:
        # Handle metadata requests
        metadata = MetadataExpert()
        response = metadata.answer_schema_question(state)
    elif "exploratory" in intents:
        # Handle exploratory requests (data retrieval questions)
        metadata = MetadataExpert()
        response = metadata.answer_exploratory_question(state)
    elif "system" in intents:
        # Handle system requests
        response = generate_system_response(state)
        
    elif "customization" in intents:
        # Handle customization requests
        response = generate_customization_response(state)
        
    else:
        # Handle visualization, insight, and explanation intents
        response = generate_analysis_response(state, intents)
    
    return state.copy(update={
        "messages": messages,
        "response": response
    })


async def route_intent(state: State):
    intents = state.intents
    
    # Handle single intents first
    if len(intents) == 1:
        if "schema" in intents:
            return "schema"
        elif "exploratory" in intents:
            return "exploratory"
        elif "visualization" in intents:
            return "visualization"
        elif "insight" in intents:
            return "insight"
        elif "explanation" in intents:
            return "explanation"
        elif "customization" in intents:
            return "customization"
        elif "system" in intents:
            return "system"
        else:
            return "other"
    
    # Handle multiple intent combinations
    elif len(intents) > 1:
        if "visualization" in intents and "insight" in intents and "explanation" in intents:
            return "visualization_insight_explanation"
        elif "visualization" in intents and "insight" in intents:
            return "visualization_insight"
        elif "visualization" in intents and "explanation" in intents:
            return "visualization_explanation"
        elif "insight" in intents and "explanation" in intents:
            return "insight_explanation"
        elif "schema" in intents and "insight" in intents:
            return "schema_insight"
        elif "exploratory" in intents and "insight" in intents:
            return "exploratory_insight"
        elif "exploratory" in intents and "visualization" in intents:
            return "exploratory_visualization"
        else:
            # Default fallback for other combinations
            return "other"
    
    return "other"

async def route_after_preprocessor(state: State):
    intents = state.intents
    
    if "visualization" in intents and "insight" in intents and "explanation" in intents:
        return "graph_ranker"
    elif "visualization" in intents and "insight" in intents:
        return "graph_ranker"
    elif "visualization" in intents and "explanation" in intents:
        return "graph_ranker"
    elif "visualization" in intents:
        return "graph_ranker"
    elif "insight" in intents and "explanation" in intents:
        return "insight_generator"
    elif "insight" in intents:
        return "insight_generator"
    elif "explanation" in intents:
        return "insight_generator"
    elif "exploratory" in intents:
        return "response_generator"
    else:
        return "response_generator"

async def route_after_graph_ranker(state: State):
    intents = state.intents
    
    if "insight" in intents or "explanation" in intents:
        return "insight_generator"
    else:
        return "response_generator"

async def route_after_insight_generator(state: State):
    intents = state.intents
    
    if "explanation" in intents:
        return "explanation_generator"
    else:
        return "response_generator"
    
async def route_after_metadata_retriever(state: State):
    """Route after metadata retrieval based on remaining intents."""
    intents = state.intents

    if "insight" in intents or "explanation" in intents or "visualization" in intents:
        return "sql_generator"
    else:
        return "response_generator"



builder = StateGraph(State)
builder.add_node("intent_classifier", intent_classifier)
builder.add_node("metadata_retriever", metadata_retriever)
builder.add_node("sql_generator", sql_generator)
builder.add_node("sql_executor", sql_executor)
builder.add_node("data_preprocessor", data_preprocessor)
builder.add_node("graph_ranker", graph_ranker)
builder.add_node("insight_generator", insight_generator)
builder.add_node("explanation_generator", explanation_generator)
builder.add_node("response_generator", response_generator)
builder.add_node("customizer", customizer)
builder.add_node("system", system)


# Initial routing
builder.add_edge(START, "intent_classifier")
builder.add_conditional_edges(
    "intent_classifier",
    route_intent, 
    {
        "schema": "metadata_retriever",            
        "exploratory": "sql_generator",              
        "schema_insight": "metadata_retriever",         
        "exploratory_insight": "sql_generator",         
        "exploratory_visualization": "sql_generator",    
        "visualization": "sql_generator",
        "insight": "sql_generator", 
        "explanation": "sql_generator",
        "customization": "customizer",
        "system": "system",
        "other": "response_generator",
        "visualization_insight": "sql_generator",
        "visualization_explanation": "sql_generator", 
        "insight_explanation": "sql_generator",
        "visualization_insight_explanation": "sql_generator",
    },
)

builder.add_conditional_edges(
    "metadata_retriever",
    route_after_metadata_retriever,
    {
        "sql_generator": "sql_generator",      # ← Continue with insight workflow
        "response_generator": "response_generator",  # ← Just metadata query
    }
)

# Exploratory queries: sql_generator -> sql_executor -> response_generator
builder.add_edge("sql_generator", "sql_executor")

# Add conditional routing after sql_executor
builder.add_conditional_edges(
    "sql_executor",
    lambda state: "response_generator" if "exploratory" in state.intents and len(state.intents) == 1 else "data_preprocessor",
    {
        "response_generator": "response_generator",  # Pure exploratory query
        "data_preprocessor": "data_preprocessor",    # Need further processing
    }
)

# Conditional routing after data preprocessing
builder.add_conditional_edges(
    "data_preprocessor",
    route_after_preprocessor,
    {
        "graph_ranker": "graph_ranker",
        "insight_generator": "insight_generator",
        "response_generator": "response_generator",
    }
)

# Conditional routing after graph ranking
builder.add_conditional_edges(
    "graph_ranker",
    route_after_graph_ranker,
    {
        "insight_generator": "insight_generator",
        "response_generator": "response_generator",
    }
)

# Conditional routing after insight generation
builder.add_conditional_edges(
    "insight_generator",
    route_after_insight_generator,
    {
        "explanation_generator": "explanation_generator",
        "response_generator": "response_generator",
    }
)

# Terminal edges
builder.add_edge("explanation_generator", "response_generator")
builder.add_edge("customizer", END)
builder.add_edge("system", END)
builder.add_edge("response_generator", END)

workflow = builder.compile()