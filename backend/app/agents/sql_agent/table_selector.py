from cmd import PROMPT
import google.generativeai as genai

from app.config import settings
from app.utils.logging import logger
from app.agents.sql_agent.vectordb_functions.querying_vectordb import query_vectordb

table_schemas = query_vectordb(prompt,20)
question = PROMPT
top_n = 20



class tableSelector:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel("gemini-2.0-flash")

    def select_tables(self):
        prompt = f"""You are a data scientist that can help select the most relevant tables for SQL query tasks.

                    Please select the most relevant table(s) that can be used to generate SQL query for the question.

                    ===Response Guidelines
                    - Only return the most relevant table(s).
                    - Return at most {top_n} tables.
                    - Response should be a valid JSON array of table names which can be parsed by Python json.loads(). For a single table, the format should be ["table_name"].

                    ===Tables
                    {table_schemas}

                    ===Question
                    {question}"""
        response = self.model.generate_content(prompt)
        logger.info(f"Summerized logs: {response.text}")
        return response.text