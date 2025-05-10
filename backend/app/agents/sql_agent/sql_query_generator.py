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
        - Use only the table and column names exactly as they appear in metadata.
        - Strictly follow the syntax rules of the specified sql_dialect.
        - For MySQL:
            - Use DATE_FORMAT(column, '%Y-%m') to extract year-month.
            - Use MONTH(column) to extract the month as a number (1–12).
            - Do NOT use STRFTIME or CAST(... AS INTEGER).
        - For SQLite:
            - Use STRFTIME('%Y-%m', column) for year-month.
            - Use CAST(STRFTIME('%m', column) AS INTEGER) for month number.
        - Filter out rows where any column used in the query is NULL, "", or "N/A".
        - Use aggregation and filtering functions only supported by the sql_dialect.
        - If the user's question does not provide enough information to create a valid SQL query, return: NOT_ENOUGH_INFO
        - If the question is not related to SQL, return: NOT_SQL_QUERY
        - Just output the SQL query string — no comments, no markdown, no explanation.

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
        