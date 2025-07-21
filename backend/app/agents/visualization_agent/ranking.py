from pymongo import MongoClient
from app.config import settings

# LLM graph types
GRAPHS = [
    "Area Chart", "Bar Chart", "Histogram"
]

# Weights for user interaction signals
WEIGHTS = {
    "like_count": 3.0,
    "dislike_count": -3.0,     
    "export_count": 2.0,
    "time_spent": 0.01,
    "pan_count": 0.001,
}


client = MongoClient(settings.MONGO_URI)
db = client[settings.DATABASE_NAME]
collection = db["GraphInteractions"]    


def get_ranked_graphs_for_user(user_email: str):
    """
    Rank all supported graph types for this user, using their interaction data.

    Args:
        user_email (str): The user's email

    Returns:
        List[str]: Names of the supported graphs, most relevant first.
    """
    graph_scores = {graph: 0.0 for graph in GRAPHS}
    all_docs = collection.find({"email": user_email})

    for doc in all_docs:
        graph_name = doc.get("graph_name")
        if graph_name in GRAPHS:
            for field, weight in WEIGHTS.items():
                value = doc.get(field, 0)
                graph_scores[graph_name] += weight * value

    
    ranked_graphs = sorted(graph_scores.items(), key=lambda x: x[1], reverse=True)
    ranked_graph_names = [graph for graph, _ in ranked_graphs]

    return ranked_graph_names



