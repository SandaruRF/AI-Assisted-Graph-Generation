import os
import google.generativeai as genai
from config import settings
from utils.logging import logger
import json

class IntentClassifier:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel("gemini-2.0-flash")
    
    def classify_intent(self, query: str) -> dict:
        prompt = f"""
        Classify the intent(s) of the following user query. The query may involve one or more intents.
        Query: "{query}"
        Possible intents: visualization, insight, explanation, metadata, system, customization, other.

        For each intent, classify as follows:
        - visualization: User only wants to generate basic, compare, or aggregated visualization.
        - insight: User only wants to find trends, anomalies, or correlations.
        - explanation: User only wants to generate explanations about the insights.
        - metadata: User ONLY asks questions related to the database schema (e.g., "What tables are in the database?", "What are the columns in the 'sales' table?") or requests summary statistics (e.g., "What is the mean revenue?", "What is the standard deviation of product prices?").
        - customization: User only wants to customize the generated graph (e.g., change color, add filter, change graph type, etc.). Assume the user already has a graph generated.
        - system: User only wants to connect to a different database, export, or share the generated graph.
        - other: User wants to do something else.

        Return a JSON object with the following structure:
        {{
            "intent": ["intent1", "intent2"],  # List of intents
            "confidence": 0.95,  # Confidence score (float between 0 and 1)
            "reason": ["reason for intent1", "reason for intent2"]  # Reasons for each identified intent
        }}

        Ensure the response is a valid JSON format, contains both 'intent' and 'confidence', and provides a 'reason' for each intent. Avoid extra text or markdown—just the raw JSON object.
        """
        
        try:
            response = self.model.generate_content(prompt)
            
            if not response or not response.text:
                logger.error("Error: Received an empty response from Gemini API.")
                return {"intent": "unknown", "confidence": 0.0}

            result = response.text.strip()
            result = result.replace("```json", "").replace("```", "").strip()
            logger.info(f"Gemini Response: {result}")

            try:
                parsed_result = json.loads(result)
                if "intent" in parsed_result and "confidence" in parsed_result:
                    return parsed_result
            except json.JSONDecodeError as e:
                logger.error(f"JSON Parsing Error: {e}")

            return {"intent": "unknown", "confidence": 0.0}

        except Exception as e:
            logger.error(f"Error classifying intent: {e}")
            return {"intent": "unknown", "confidence": 0.0}
        