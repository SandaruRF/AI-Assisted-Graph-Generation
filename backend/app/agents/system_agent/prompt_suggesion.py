import google.generativeai as genai
import json

from app.config import settings
from app.utils.logging import logger
from app.state import State

class SuggestionExpert:
    def __init__(self):
        genai.configure(api_key=settings.GOOGLE_API_KEY)
        self.model = genai.GenerativeModel("gemini-2.0-flash")
    
    def suggest_prompt(self, state: State) -> dict:
        prompt = f"""
        You are an intelligent assistant in an "AI-Assisted Graph Generator" system. Based on the user's current query and available data context, generate exactly 2 relevant prompt suggestions that would help the user explore their data further.

        CURRENT USER QUERY: "{state.user_prompt}"

        METADATA CONTEXT: "{state.metadata}"

        TASK:
        Generate exactly 3 short, actionable prompt suggestions (max 6 words each) that would be most relevant for the user's next query. Consider:

        1. **Natural progression** from their current query
        2. **Data-appropriate visualizations** based on available information
        3. **Analytical insights** that match the context
        4. **Practical next steps** for data exploration

        RESPONSE FORMAT:
        Return your response as a JSON object with this exact structure:
        {{
            "suggestions": [
                "First suggestion",
                "Second suggestion"
            ]
        }}

        GUIDELINES:
        - If user query is a greeting: Suggest basic exploration prompts
        - If metadata shows data is loaded: Suggest analysis based on data characteristics
        - If user asks about charts: Suggest chart customizations (change colors, types, etc.)
        - If user asks for insights: Suggest deeper analysis options
        - Keep suggestions actionable and specific to their context
        """
        
        try:
            response = self.model.generate_content(prompt)
            
            if not response or not response.text:
                logger.error("Error: Received an empty response from Gemini API.")
                return {"suggestions": ["Explore data patterns", "Create visualization", "Analyze trends"]}

            result = response.text.strip()
            result = result.replace("```json", "").replace("```", "").strip()
            logger.info(f"Gemini Response: {result}")

            try:
                parsed_result = json.loads(result)
                if "suggestions" in parsed_result:
                    return parsed_result
            except json.JSONDecodeError as e:
                logger.error(f"JSON Parsing Error: {e}")

            return {"suggestions": ["Explore data patterns", "Create visualization", "Analyze trends"]}

        except Exception as e:
            logger.error(f"Error generating prompt suggestions: {e}")
            return {"suggestions": ["Explore data patterns", "Create visualization", "Analyze trends"]}