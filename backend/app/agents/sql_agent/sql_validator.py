# import google.generativeai as genai
from anthropic import Anthropic
from app.config import settings
from app.utils.logging import logger
import json, re

class SQLQueryValidator:
    def __init__(self):
        # genai.configure(api_key=settings.GOOGLE_API_KEY)
        # self.model = genai.GenerativeModel("gemini-2.0-flash")
        self.client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        self.model = "claude-3-5-sonnet-20241022"

    def validate_sql_query(self, sql_query: str, metadata: str, sql_dialect: str) -> str:
        print(f"SQL Query: {sql_query}")
        print(f"Schema: {metadata}")
        print(f"SQL Dialect: {sql_dialect}")
        
        prompt = f"""You are an AI assistant that validates and fixes SQL queries. Your task is to:
        1. Check if the SQL query is valid according to the specified SQL dialect.
        2. Ensure all table and column names are correctly spelled and exist in the schema.
        3. If there are any issues, fix them and provide the corrected SQL query.
        4. If no issues are found, return the original query.

        ===SQL Dialect:
        {sql_dialect}

        ===Database schema:
        {metadata}

        ===Generated SQL query:
        {sql_query}

        Respond in JSON format with the following structure. Only respond with the JSON:
        {{
            "valid": boolean,
            "issues": string or null,
            "corrected_query": string
        }}

        For example:
        1. {{
            "valid": true,
            "issues": null,
            "corrected_query": "None"
        }}

        2. {{
            "valid": false,
            "issues": "Column USERS does not exist",
            "corrected_query": "SELECT * FROM users WHERE age > 25"
        }}
        """
        
        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=1000,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            logger.info("Response from Claude API: %s", response)
            
            if not response or not response.content:
                logger.error("Error: Received an empty response from Claude API.")
                return sql_query  # Return original query instead of error string
            
            # Correct way to access Claude response
            text = response.content[0].text
            
            # Try to extract JSON from markdown code blocks
            json_match = re.search(r'``````', text, re.DOTALL)
            if json_match:
                json_str = json_match.group(1)
            else:
                # If no code blocks, try to parse the entire response
                json_str = text.strip()
            
            try:
                parsed_result = json.loads(json_str)
                logger.info("SQL query validated successfully.")
                logger.info(f"Validated SQL query: {parsed_result}")
                
                if parsed_result.get('valid', False):
                    logger.info("SQL query is valid.")
                    return sql_query
                else:
                    corrected = parsed_result.get('corrected_query', sql_query)
                    if corrected and corrected != "None":
                        logger.info(f"SQL query is invalid, using corrected: {corrected}")
                        return corrected
                    else:
                        logger.warning("No valid correction provided, returning original query")
                        return sql_query
                        
            except json.JSONDecodeError as e:
                logger.error(f"JSON parsing error: {e}")
                logger.error(f"Raw response text: {text}")
                return sql_query  # Return original query instead of error string
                
        except Exception as e:
            logger.error(f"Error validating sql query: {e}")
            return sql_query  # Return original query instead of error string
