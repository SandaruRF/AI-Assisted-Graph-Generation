import google.generativeai as genai
from typing import Dict, Any, List
import json

from app.config import settings
from app.utils.logging import logger
from app.state import State

SUPPORTED_GRAPH_TYPES = {
    "num_0_cat_1_temp_0": ["Histogram"],
    "num_1_cat_0_temp_0": ["Area Chart", "Box Plot", "Histogram", "Normalized Histogram", "Line Chart"],
    "num_n_cat_0_temp_0": ["Histogram", "Stacked Histogram"],
    "num_1_cat_0_temp_1": ["Area Chart", "Box Plot", "Bar Chart", "Histogram", "Line Chart", "Scatter Plot"],
    "num_1_cat_1_temp_0": ["Area Chart", "Box Plot", "Bar Chart", "Grouped Histogram", "Stacked Histogram", "Line Chart", "Pie Chart", "Donut Chart"],
    "num_1_cat_1_temp_1": ["Area Chart", "Stacked Bar Chart", "Grouped Bar Chart", "Line Chart"],
    "num_n_cat_1_temp_0": ["Stacked Bar Chart", "Grouped Bar Chart"],
    "num_1_cat_2_temp_0": ["Stacked Bar Chart", "Grouped Bar Chart", "Box Plot", "Pie Chart", "Donut Chart"],
    "num_1_cat_2_temp_1": ["Line Chart"],
    "num_2_cat_0_temp_0": ["Area Chart", "Scatter Plot"],
    "num_2_cat_0_temp_1": ["Area Chart", "Line Chart", "Scatter Plot"],
    "num_2_cat_1_temp_0": ["Scatter Plot"],
    "num_2_cat_1_temp_1": ["Area Chart", "Line Chart", "Scatter Plot"],
    "num_2_cat_2_temp_0": ["Scatter Plot"],
    "num_3_cat_0_temp_0": ["Bubble Chart"],
    "num_3_cat_1_temp_0": ["Bubble Chart"],
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
        genai.configure(api_key=settings.GOOGLE_API_KEY)
        self.model = genai.GenerativeModel("gemini-2.0-flash")
    
    def recommend_graphs(self, state: State, suitable_graphs: List[str]) -> Dict[str, List[str]]:
        prompt = f'''
        You are a graph ranking system. Rank ALL provided graph types by suitability.

        Dataset: {state.num_numeric} numeric, {state.num_cat} categorical, {state.num_temporal} temporal columns
        User request: "{state.user_prompt}"

        GRAPHS TO RANK (you must rank ALL of these):
        {chr(10).join([f"- {graph}" for graph in suitable_graphs])}

        REQUIREMENTS:
        1. Rank ALL {len(suitable_graphs)} graphs above
        2. Order: most suitable → least suitable  
        3. Use exact names from the list
        4. Include EVERY graph in your response

        JSON format:
        {{
        "recommended_graphs": ["most_suitable", "second_most", "third_most", "...", "least_suitable"]
        }}

        Return exactly {len(suitable_graphs)} graphs in your ranking.
        '''

        
        try:
            response = self.model.generate_content(prompt)
            result = response.text.strip()
            result = result.replace("```json", "").replace("```", "").strip()
            print("="*20)
            print(suitable_graphs)
            print("="*20)
            print(f"Graphs: {result}")
            print("="*20)
            # Parse JSON and return dictionary
            try:
                parsed_result = json.loads(result)
                
                # Validate the structure
                if "recommended_graphs" not in parsed_result:
                    logger.warning("Missing 'recommended_graphs' in response")
                    return {"recommended_graphs": suitable_graphs[:2]}
                
                # Validate that recommended graphs are from available options
                recommended = parsed_result["recommended_graphs"]
                valid_recommendations = [graph for graph in recommended if graph in suitable_graphs]
                
                if not valid_recommendations:
                    logger.warning("No valid recommendations found")
                    return {"recommended_graphs": suitable_graphs[:2]}
                    
                return {"recommended_graphs": valid_recommendations}
                
            except json.JSONDecodeError as e:
                logger.error(f"JSON parsing error: {e}")
                logger.error(f"Raw response: {result}")
                return {"recommended_graphs": suitable_graphs[:2]}
                
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            return {"recommended_graphs": suitable_graphs[:1] if suitable_graphs else []}