import google.generativeai as genai

from app.config import settings
from app.utils.logging import logger

class SQLQueryGenerator:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel("gemini-2.0-flash")
    
    def generate_sql_query(self, nl_query: str, metadata: str, sql_dialect: str) -> str:
        print(f"Question: {nl_query}")
        print(f"Schema: {metadata}")
        print(f"SQL Dialect: {sql_dialect}")
        prompt = f"""
            You are an AI assistant that generates SQL queries based on the user's natural language question (nl_query), 
            the provided database schema (metadata), and the SQL dialect (sql_dialect). Your job is to generate an accurate 
            and syntactically valid SQL query for the specified dialect.

            Instructions:
            - Use only the table and column names available in metadata.
            - Strictly follow the syntax rules of the given sql_dialect.
            - Use only the spellings of column and table names exactly as they appear in metadata.
            - Filter out rows where any column used in the query is NULL, "", or "N/A".
            - For aggregation, grouping, or filtering, use functions and syntax supported by sql_dialect.
            - If the user's question does not provide enough information to create a valid SQL query, return: NOT_ENOUGH_INFO
            - Just output the query string — no comments, no markdown, no explanation.

            Question: {nl_query}

            Database schema: {metadata}

            sql_dialect: {sql_dialect}
            """
        
        try:
            response = self.model.generate_content(prompt)
            
            if not response or not response.text:
                logger.error("Error: Received an empty response from Gemini API.")
                return "SQL_GENERATION_FAILED"

            result = response.text.strip()
            result = result.replace("```sql", "").replace("```", "").strip()
            logger.info("SQL query generated successfully.")
            logger.info(f"SQL query: {result}")
            return result

        except Exception as e:
            logger.error(f"Error generating sql query: {e}")
            return "SQL_GENERATION_FAILED"
        