import os
import google.generativeai as genai
import json

from app.config import settings
from app.utils.logging import logger

class EntityExtractor:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel("gemini-2.0-flash")

    def extract_customization_entities(self, query: str) -> dict:
        prompt = f"""
        Extract customization-related entities from the following user prompt.
        Query: "{query}"

        Possible entities to extract:
        - chart_type: "bar", "line", "pie", etc.
        - colors: a list of color names (e.g., ["red", "green"])
        - x_label: label for x-axis (e.g., "Month")
        - y_label: label for y-axis (e.g., "Revenue")
        - legend_labels: dictionary of old label → new label (optional)

        Return a valid JSON object with only the extracted values.
        If a value is not present in the query, return null or an empty structure.

        Example format:
        {{
            "chart_type": "pie",
            "colors": ["red", "green"],
            "x_label": "Month",
            "y_label": "Revenue",
            "legend_labels": {{"rev": "Revenue"}}
        }}
        """
        try:
            response = self.model.generate_content(prompt)
            
            if not response or not response.text:
                logger.error("Empty response from Gemini while extracting entities.")
                return {}

            raw_text = response.text.strip().replace("```json", "").replace("```", "")
            logger.info(f"Entity Extractor Response: {raw_text}")

            try:
                return json.loads(raw_text)
            except json.JSONDecodeError as e:
                logger.error(f"JSON Parsing Error in entity extraction: {e}")
                return {}
        except Exception as e:
            logger.error(f"Entity extraction exception: {e}")
            return {}
