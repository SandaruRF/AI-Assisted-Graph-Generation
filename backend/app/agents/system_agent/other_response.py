import os
import google.generativeai as genai
from config import settings
from utils.logging import logger
import json

class System:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel("gemini-2.0-flash")
    
    def other_response(self, query: str) -> str:
        prompt = f"""
        You are a friendly assistant in a system called "AI-Assisted Graph Generator", designed to help users generate graphs, gain insights, and explore structured data through natural language.

        The user has sent the following query: "{query}"

        Your task:
        - Respond politely and helpfully.
        - If the query is a greeting, compliment, or casual small talk, respond warmly and redirect the user to try something related to data or graphs.
        - If the query is a thank you or appreciation, acknowledge it kindly.
        - If the query is unrelated to data visualization or insights, respond briefly, mention the system's focus, and encourage the user to ask something data-related.
        - Do NOT hallucinate or go off-topic. Stay in the assistant role.

        Keep your response short, natural, and friendly.
        """
        
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip() if response else "I'm here to help you explore your data! Ask me anything data-related."

        except Exception as e:
            logger.error(f"Error generating response: {e}")
            return "I'm here to help you explore your data! Ask me anything data-related."