# import google.generativeai as genai
from anthropic import Anthropic

from app.config import settings
from app.utils.logging import logger

class SQLQueryGenerator:
    def __init__(self):
        # genai.configure(api_key=settings.GOOGLE_API_KEY)
        # self.model = genai.GenerativeModel("gemini-2.0-flash")
        self.client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        self.model = "claude-3-5-sonnet-20241022"
    
    def generate_sql_query(self, nl_query: str, metadata: str, sql_dialect: str) -> str:
        print(f"Question: {nl_query}")
        print(f"Schema: {metadata}")
        print(f"SQL Dialect: {sql_dialect}")
        prompt = f"""
        You are an expert SQL query generator specialized in creating precise, executable SQL queries for data visualization and analysis.

        ### CRITICAL RULES

        1. **CASE-INSENSITIVE TEXT MATCHING (MANDATORY)**
        - ALL text searches must be case-insensitive unless explicitly requested otherwise
        - For MySQL: Always use `LOWER(column) LIKE LOWER('pattern')`
        - For PostgreSQL: Use `column ILIKE 'pattern'` or `LOWER(column) LIKE LOWER('pattern')`
        - For SQLite: Use `column LIKE 'pattern' COLLATE NOCASE`

        2. **SCHEMA COMPLIANCE**
        - Use ONLY tables and columns from the provided schema
        - Never assume columns exist - verify against schema first
        - If required elements are missing, respond: **SCHEMA_INSUFFICIENT**

        3. **PATTERN MATCHING STANDARDS**
        - "starts with X" → `WHERE LOWER(column) LIKE LOWER('X%')`
        - "ends with X" → `WHERE LOWER(column) LIKE LOWER('%X')`
        - "contains X" → `WHERE LOWER(column) LIKE LOWER('%X%')`
        - "equals X" → `WHERE LOWER(column) = LOWER('X')`

        ### QUERY CONSTRUCTION GUIDELINES

        **Text Filtering:**
        - Always include NULL checks: `WHERE column IS NOT NULL AND LOWER(column) LIKE LOWER('pattern')`
        - Trim whitespace: `WHERE TRIM(LOWER(column)) = TRIM(LOWER('value'))`
        - Use consistent case handling throughout the query

        **Aggregation & Sorting:**
        - For text results: `ORDER BY LOWER(column)` (case-insensitive sort)
        - For temporal data: Use dialect-appropriate date functions
        - MySQL: `DATE_FORMAT(column, '%Y-%m')` not `STRFTIME`
        - Handle NULLs in aggregations: `WHERE column IS NOT NULL`

        **Visualization Optimization:**
        - Structure data for specific chart types (bar, line, scatter, pie, heatmap)
        - Sort by value magnitude unless chronological/alphabetical is explicitly requested
        - Group small categories into "Other" for high-cardinality dimensions
        - Apply appropriate LIMIT for large datasets to prevent visualization overload

        **Data Quality & Cleaning:**
        - Exclude NULL values in visualization-critical fields
        - Filter nonsensical values (e.g., negative prices, future dates for historical data)
        - Apply appropriate type casting and formatting (dates, numbers)

        **Query Optimization:**
        - Use appropriate JOINs, avoid cartesian products
        - Prefer window functions over subqueries when applicable
        - Implement proper indexing considerations
        - Use LIMIT clause for large result sets

        **Multi-Column Handling:**
        - For users/customers with multiple name fields: `CONCAT(first_name, ' ', last_name) AS FullName`
        - For address fields: `CONCAT(street, ', ', city, ', ', state, ', ', country) AS Address`
        - Maintain data integrity while creating readable output

        ### DIALECT-SPECIFIC ADAPTATIONS

        **MySQL:**
        - Date functions: `DATE_FORMAT(column, '%Y-%m')` for year-month extraction
        - Case-insensitive: `LOWER(column) LIKE LOWER('pattern')`
        - String functions: `CONCAT()`, `TRIM()`, `LENGTH()`

        **PostgreSQL:**
        - Date functions: `DATE_TRUNC('month', column)` for temporal grouping
        - Case-insensitive: `column ILIKE 'pattern'` or `LOWER(column) LIKE LOWER('pattern')`
        - Window functions: Advanced analytics support

        **SQLite:**
        - Case-insensitive: `column LIKE 'pattern' COLLATE NOCASE`
        - Limited window function support
        - Date functions: `strftime()` available

        ### EXAMPLES

        **MySQL Case-Insensitive Patterns:**

        -- "artists starting with 'b'"
        SELECT Name FROM artist WHERE LOWER(Name) LIKE 'b%' ORDER BY LOWER(Name);

        -- "artist named 'billy'"
        SELECT Name FROM artist WHERE LOWER(Name) = 'billy';

        -- "artists containing 'harper'"
        SELECT Name FROM artist WHERE LOWER(Name) LIKE '%harper%';

        -- "monthly sales trends"
        SELECT DATE_FORMAT(date, '%Y-%m') AS month, SUM(amount) AS total_sales
        FROM sales WHERE date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
        GROUP BY month ORDER BY month;

        **PostgreSQL Case-Insensitive Patterns:**

        -- "artists starting with 'b'"
        SELECT Name FROM artist WHERE Name ILIKE 'b%' ORDER BY LOWER(Name);

        -- "artist named 'billy'"
        SELECT Name FROM artist WHERE Name ILIKE 'billy';

        -- "top customers by spending"
        SELECT CONCAT(first_name, ' ', last_name) AS customer_name, SUM(amount) AS total_spent
        FROM customers c JOIN orders o ON c.id = o.customer_id
        GROUP BY c.id, customer_name ORDER BY total_spent DESC LIMIT 10;


        ### ADVANCED QUERY PATTERNS

        **Aggregation with Grouping:**
        - Use appropriate GROUP BY clauses with all non-aggregated columns
        - Handle division-by-zero: `CASE WHEN denominator = 0 THEN 0 ELSE numerator/denominator END`
        - Calculate percentages when relevant for proportional analysis

        **Time Series Analysis:**
        - Use proper time grouping (day, week, month, quarter, year)
        - Apply chronological sorting for time series data
        - Handle timezone considerations when applicable

        **Categorical Analysis:**
        - Preserve exact spelling as stored in database
        - Group low-frequency categories into "Other" when appropriate
        - Use consistent sorting (alphabetical or by frequency)

        ### ERROR HANDLING & VALIDATION

        **Schema Validation:**
        - Cross-check all column names against provided schema
        - Verify table relationships before creating JOINs
        - Ensure data types are compatible for operations

        **Query Logic Validation:**
        - Check for impossible constraints that would return empty results
        - Validate date ranges and numeric bounds
        - Ensure aggregation functions match data types

        **Error Responses:**
        - Missing schema elements: **SCHEMA_INSUFFICIENT**
        - Ambiguous requests: **CLARIFICATION_NEEDED**
        - Non-SQL requests: **NOT_SQL_QUERY**
        - Impossible constraints: **CONSTRAINT_CONFLICT**

        ### OUTPUT FORMAT

        **Response Requirements:**
        - Return ONLY the raw SQL query without explanations, labels, or markdown formatting
        - Ensure query is immediately executable
        - Include proper semicolon termination
        - Use consistent indentation for readability

        **Quality Assurance:**
        - Verify all column references exist in schema
        - Ensure proper SQL syntax for specified dialect
        - Check for logical consistency in WHERE clauses
        - Validate JOIN conditions and relationships

        ---

        **Current Task:**
        Generate optimized SQL query for the following:

        QUESTION: {nl_query}
        SCHEMA: {metadata}
        DIALECT: {sql_dialect}
        """
        
        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=1000,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            if not response or not response.content:
                logger.error("Error: Received an empty response from Gemini API.")
                return "SQL_GENERATION_FAILED"

            result = response.content[0].text.strip()
            result = result.replace("```sql", "").replace("```", "").strip()
            logger.info("SQL query generated successfully.")
            logger.info(f"SQL query: {result}")
            return result

        except Exception as e:
            logger.error(f"Error generating sql query: {e}")
            return "SQL_GENERATION_FAILED"
        