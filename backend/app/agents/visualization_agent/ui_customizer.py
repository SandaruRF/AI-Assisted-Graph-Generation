# backend/app/agents/VisualizationAgent/ui_customizer.py

from app.state import State
from typing import Dict

def apply_customization_to_state(state: State, extracted_entities: Dict) -> State:
    """
    Apply customization-related entities to the current graph state.
    """
    if extracted_entities.get("chart_type"):
        state.chart_type = extracted_entities["chart_type"]

    if extracted_entities.get("colors"):
        state.colors = extracted_entities["colors"]

    if extracted_entities.get("x_label"):
        state.x_label = extracted_entities["x_label"]

    if extracted_entities.get("y_label"):
        state.y_label = extracted_entities["y_label"]

    if extracted_entities.get("legend_labels"):
        state.legend_labels = extracted_entities["legend_labels"]

    return state
