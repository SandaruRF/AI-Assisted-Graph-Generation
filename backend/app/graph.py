from langgraph.constants import START, END, Send
from langgraph.graph import StateGraph

from pydantic import BaseModel
from typing import List

from agents.intent_agent.intent_classifier import IntentClassifier
from agents.visualization_agent.graph_recommender import GraphModel
from agents.system_agent.other_response import System

class State(BaseModel):
    user_prompt: str
    intents: List[str]
    response: str

# Nodes
def intent_classifier(state: State) -> State:
    """Intent classifier identifies user intents from the query."""
    classifier = IntentClassifier()
    intents = classifier.classify_intent(state.user_prompt)
    state.intents = intents["intent"]
    print("Intent identification successfull.")
    return state

def other_response_generator(state: State) -> State:
    """Generate responses if intent classifier identifies intent as 'other'."""
    system = System()
    response = system.other_response(state.user_prompt)
    state.response = response
    print(response)
    return state

# def sql_generator():
#     """Generates SQL queries from user input."""
#     print("SQL query generation successfull.")

# def data_fetcher():
#     """Fetches data from SQL database."""
#     print("Data fetching successfull.")

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

# def synthesizer():
#     """Synthesize final response."""
#     print("Final response synthesize successfully.")

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
builder.add_node("other_response", other_response_generator)
# builder.add_node("sql_agent", sql_agent.compile())
# builder.add_node("analysis_agent", analysis_agent.compile())
# builder.add_node("explanation_agent", explanation_agent.compile())
# builder.add_node("visualization_agent", visualization_agent.compile())
# builder.add_node("synthesizer", synthesizer)

builder.add_edge(START, "intent_classifier")
# builder.add_conditional_edges(
#     "intent_classifier", route_intent, {
#         ""
#     }
# )
builder.add_edge("intent_classifier", "other_response")
builder.add_edge("other_response", END)
# builder.add_edge("intent_classifier", "sql_agent")
# builder.add_edge("sql_agent", "analysis_agent")
# builder.add_edge("analysis_agent", "explanation_agent")
# builder.add_edge("explanation_agent", "visualization_agent")
# builder.add_edge("visualization_agent", "synthesizer")
# builder.add_edge("synthesizer", END)

workflow = builder.compile()