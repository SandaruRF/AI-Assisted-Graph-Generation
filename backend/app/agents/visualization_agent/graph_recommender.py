# import google.generativeai as genai
from anthropic import Anthropic
from typing import Dict, Any, List

from app.config import settings
from app.utils.logging import logger
from app.state import State

SUPPORTED_GRAPH_TYPES = {
    "num_0_cat_1_temp_0": ["Histogram"],
    "num_1_cat_0_temp_0": ["Area Chart", "Box Plot", "Histogram", "Line Chart"],
    "num_n_cat_0_temp_0": ["Histogram"],
    "num_1_cat_0_temp_1": ["Area Chart", "Box Plot", "Bar Chart", "Histogram", "Line Chart", "Scatter Plot"],
    "num_1_cat_1_temp_0": ["Area Chart", "Box Plot", "Bar Chart", "Histogram", "Line Chart", "Pie Chart"],
    "num_1_cat_1_temp_1": ["Area Chart", "Bar Chart", "Line Chart"],
    "num_n_cat_1_temp_0": ["Bar Chart"],
    "num_1_cat_2_temp_0": ["Bar Chart", "Box Plot", "Pie Chart"],
    "num_1_cat_2_temp_1": ["Line Chart"],
    "num_2_cat_0_temp_0": ["Area Chart", "Scatter Plot"],
    "num_2_cat_0_temp_1": ["Area Chart", "Line Chart", "Scatter Plot"],
    "num_2_cat_1_temp_0": ["Scatter Plot"],
    "num_2_cat_1_temp_1": ["Area Chart", "Line Chart", "Scatter Plot"],
    "num_2_cat_2_temp_0": ["Scatter Plot"],
    "num_3_cat_0_temp_0": ["Scatter Plot"],
    "num_3_cat_1_temp_0": ["Scatter Plot"],
    "num_3_cat_2_temp_0": ["Scatter Plot"],
    "num_4_cat_0_temp_1": ["Candlestick Chart"],
    "num_4_cat_1_temp_1": ["Candlestick Chart"],
}


def get_graph_types(num_numeric, num_cat, num_temporal):
    type = f"num_{num_numeric}_cat_{num_cat}_temp_{num_temporal}"
    if type in SUPPORTED_GRAPH_TYPES:
        return SUPPORTED_GRAPH_TYPES[type]
    type = f"num_n_cat_{num_cat}_temp_{num_temporal}"
    if type in SUPPORTED_GRAPH_TYPES:
        return SUPPORTED_GRAPH_TYPES[type]
    return []


class GraphRecommender:
    def __init__(self):
        self.client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        self.model = "claude-3-5-sonnet-20241022"
    
    def recommend_graphs(self, state: State, suitable_graphs: List[str]) -> Dict[str, Any]:
        prompt = f'''
        You are an intelligent graph recommendation assistant in a system called "AI-Assisted Graph Generator".
        Your goal is to recommend and rank the most suitable graph types for visualizing a dataset, based only on the given information.

        Input details:
        - User prompt: "{state.user_prompt}"
        - Detected intents: {state.intents}
        - Dataset characteristics:
            - Number of numeric columns: {state.num_numeric}
            - Number of categorical columns: {state.num_cat}
            - Number of temporal columns: {state.num_temporal}
            - Number of rows: {state.num_rows}
            - Column cardinalities: {state.cardinalities}

        Only consider and choose from this list of supported graph types: {suitable_graphs}

        Your task:
        - Understand the user intent and dataset structure.
        - Use graph names exactly as they appear in the `suitable_graphs` list.
        - Justify your recommendation in 1-2 short sentences.
        - Rank the recommended graphs in order of suitability. (Most suitable first, and rank all suitable graphs)
        - Do not suggest any graphs outside the `suitable_graphs` list.

        ***Give list of ranked graphs by using all {suitable_graphs}. Don't remove any graph from the list. Only rank them.***

        Output format (JSON only):
        {{
        "recommended_graphs": ["<first_most_suitable>", "<second_if_applicable>", "<third_if_applicable>"],
        "reason": "<brief explanation>"
        }}

        Be concise, helpful, and never hallucinate chart types.
        '''

        
        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=1000,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            result = response.content[0].text.strip()
            result = result.replace("```json", "").replace("```", "").strip()
            return result if response else "I'm here to help you explore your data! Ask me anything data-related."

        except Exception as e:
            logger.error(f"Error generating response: {e}")
            return "I'm here to help you explore your data! Ask me anything data-related."