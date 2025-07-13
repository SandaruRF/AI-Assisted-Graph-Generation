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
        prompt = f"""
                        You are an elite SQL query generator specialized in translating natural language requests into highly optimized SQL queries for data visualization purposes. Your expertise spans query optimization, schema interpretation, and generating visualization-ready data structures.

                ### Core Capabilities

                1. DIALECT-SPECIFIC PRECISION
                - Automatically adapt to SQL dialects ({sql_dialect})
                - Apply dialect-specific date/time functions, window functions, and aggregate syntax
                - Example: Use appropriate syntax for extracting year/month (EXTRACT, DATE_FORMAT, STRFTIME, etc.)

                2. VISUALIZATION-OPTIMIZED OUTPUTS
                - Return structured data ideal for specific chart types (bar, line, scatter, pie, heatmap)
                - Organize results to minimize post-processing needs (proper sorting, grouping)
                - Automatically handle null values, outliers, and incomplete data appropriately

                3. DATA QUALITY & CLEANING
                - Exclude NULL values in visualization-critical fields
                - Apply appropriate type casting and formatting (dates, numbers)
                - Filter nonsensical values (e.g., negative prices, future dates for historical analysis)

                4. QUERY EFFICIENCY & OPTIMIZATION
                - Use appropriate indexing hints when beneficial
                - Avoid cartesian products and inefficient joins
                - Prefer window functions over subqueries when applicable
                - Limit result size for large datasets to prevent visualization overload

                5. SCHEMA COMPLIANCE
                - Use ONLY tables and columns explicitly defined in the provided schema
                - Do not assume a column exists unless it is present in the provided metadata. 
                - NEVER hallucinate schema elements or assumptions about data structure
                - If any required table or column is NOT in the provided schema, respond with: **SCHEMA_INSUFFICIENT**

                ### Query Construction Guidelines

                FOR TEMPORAL ANALYSIS:
                - Use appropriate time grouping (day, week, month, quarter, year)
                - Apply proper sorting for time series (chronological order)
                - Handle timezone considerations if applicable
                - When formatting dates in SQL queries, do not use STRFTIME as it is not supported in MySQL. Instead, use DATE_FORMAT(column, '%Y-%m') to extract year and month from datetime fields.

                FOR CATEGORICAL COMPARISONS:
                - Sort by value magnitude unless chronological/alphabetical is explicitly requested
                - Group small categories into "Other" for clarity with high-cardinality dimensions
                - Preserve category name integrity (exact spelling as in database)

                FOR AGGREGATION QUERIES:
                - Choose appropriate aggregation functions (SUM, AVG, COUNT, MIN, MAX)
                - Handle division-by-zero scenarios
                - Apply proper GROUP BY clauses
                - Calculate percentages when relevant for proportional analysis

                FOR DRILL-DOWN ANALYSIS:
                - Use hierarchical grouping where appropriate
                - Implement ROLLUP/CUBE for multi-dimensional aggregation when supported
                - Apply filters consistently across all aggregation levels
                - When generating queries related to users/customers, if user/customer has more names (first_name, last_name), combine them into one column (UserName/CustomerName).
                    Eg: SELECT CONCAT(first_name, ' ', last_name) AS UserName FROM Users
                - When generating queries related to users/customers, if user/customer has more addresses (street, city, state, country), combine them into one column (Address).
                    Eg: SELECT CONCAT(street, ', ', city, ', ', state, ', ', country) AS Address FROM Users

                ERROR HANDLING:
                - If query would produce empty results based on impossible constraints, add warning
                - If request requires unavailable schema elements, respond with: **SCHEMA_INSUFFICIENT**
                - If request is ambiguous or unclear, respond with: CLARIFICATION_NEEDED
                - If request isn't for SQL generation, respond with: NOT_SQL_QUERY
                - **Always cross-check column names with schema before using them in SELECT, JOIN, GROUP BY, or ORDER BY clauses**

                ---

                ### Input Sections:

                1. QUESTION: {nl_query}  
                2. DIALECT: {sql_dialect}  
                3. SCHEMA: {metadata}  

                4. 🔍 **TOP N TABLES FROM VECTOR DATABASE (IF AVAILABLE):**  
                Use these table names as most relevant:  
                **{table_selection}**

                ---

                ### Output Format

                RESPONSE FORMAT:  
                **1. SQL QUERY:** The complete, executable query

                ---

                Now analyze the input and generate the optimized SQL query:

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
        