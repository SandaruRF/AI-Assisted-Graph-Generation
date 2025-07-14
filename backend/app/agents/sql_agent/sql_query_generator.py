import google.generativeai as genai

from app.config import settings
from app.utils.logging import logger
from app.agents.sql_agent.table_selector import tableSelector

schema = tableSelector()

class SQLQueryGenerator:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel("gemini-2.0-flash")
    
    def generate_sql_query(self, nl_query: str,table_selection: str, sql_dialect: str, metadata: str) -> str:
        print(f"Question: {nl_query}")
        print(f"SQL Dialect: {sql_dialect}")
        prompt = f"""You are an elite SQL query generator specialized in translating natural language requests into highly optimized, executable SQL queries. 

                Your **ONLY** responsibility is to return a **raw SQL query** with absolutely no additional content.

                **STRICT OUTPUT REQUIREMENTS:**
                - Return ONLY the SQL query
                - NO explanations, comments, or descriptions
                - NO markdown formatting (no ```sql or backticks)
                - NO prefixes like "Here's the query:" or "SQL:"
                - NO suffixes or additional text
                - NO column aliases unless specifically requested
                - NO semicolons unless required by the dialect

                **RESPONSE FORMAT:**
                - Success: Return only the raw SQL query
                - Schema issues: Return only `SCHEMA_INSUFFICIENT`
                - Unclear request: Return only `CLARIFICATION_NEEDED`
                - Non-SQL request: Return only `NOT_SQL_QUERY`

                **SQL GENERATION RULES:**
                - Use `DATE_FORMAT(date, '%Y-%m')` for MySQL monthly formatting
                - Use `DATE_TRUNC('month', date)` for PostgreSQL monthly formatting
                - For full names: `CONCAT(first_name, ' ', last_name)`
                - For full address: `CONCAT(street, ', ', city, ', ', state, ', ', country)`
                - Exclude `NULL` from metrics when necessary
                - Use `LIMIT` for top-N queries
                - Always sort results logically (by value or time)
                - Use ONLY tables and columns from the provided schema

                **INPUT FORMAT:**
                QUESTION: {nl_query}
                DIALECT: {sql_dialect}
                SCHEMA: {metadata}
                TABLE_SELECTION (optional): {table_selection}

                **Example:**
                INPUT:
                QUESTION: Show me the monthly revenue for the past 12 months
                DIALECT: MySQL
                SCHEMA: orders(id, order_date, total_price)

                OUTPUT:
                SELECT DATE_FORMAT(order_date, '%Y-%m'), SUM(total_price)
                FROM orders
                WHERE order_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
                GROUP BY DATE_FORMAT(order_date, '%Y-%m')
                ORDER BY DATE_FORMAT(order_date, '%Y-%m')


        """

        
        try:
            response = self.model.generate_content(prompt)
            
            if not response or not response.text:
                logger.error("Error: Received an empty response from Gemini API.")
                return "SQL_GENERATION_FAILED"

            result = response.text.strip()
            result = result.replace("```sql", "").replace("```", "").strip()
            logger.info("SQL query generated successfully.")
            #logger.info(f"SQL query: {result}")
            return result

        except Exception as e:
            #logger.error(f"Error generating sql query: {e}")
            return "SQL_GENERATION_FAILED"
        