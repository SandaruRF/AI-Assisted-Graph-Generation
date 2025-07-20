import google.generativeai as genai
from app.config import settings
from app.utils.logging import logger
import json,re

class SQLQueryValidator:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel("gemini-2.0-flash")

    def validate_sql_query(self, sql_query:str, metadata:str, sql_dialect:str) -> str:
        print(f"SQL Query: {sql_query}")
        print(f"Schema: {metadata}")
        print(f"SQL Dialect: {sql_dialect}")
        prompt = f"""You are an AI assistant that validates and fixes SQL queries. Your task is to:
        1. Check if the SQL query is valid according to the specified SQL dialect.
        2. Ensure all table and column names are correctly spelled and exist in the schema.
        3. If there are any issues, fix them and provide the corrected SQL query.
        4. If no issues are found, return the original query.

        Respond in JSON format with the following structure. Only respond with the JSON:
        {{
            "valid": boolean,
            "issues": string or null,
            "corrected_query": string
        }}

        '''),
        ("human", '''===SQL Dialect:
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
            response = self.model.generate_content(prompt)
            logger.info("Response from Gemini API: %s", response)
            
        
            if not response or not response.text:
                logger.error("Error: Received an empty response from Gemini API.")
                return "SQL_VALIDATION_FAILED_NO_RESPONSE"
            text = response.candidates[0].content.parts[0].text
            json_str = re.search(r'```json\n(.*?)```', text, re.DOTALL).group(1)
            parsed_result = json.loads(json_str)
            logger.info("SQL query validated successfully.")
            logger.info(f"Validated SQL query: {parsed_result}")
            if parsed_result['valid']:
                logger.info("SQL query is valid.")
                return sql_query
            else:
                logger.info("SQL query is invalid.", parsed_result)
                return parsed_result['corrected_query']
        except Exception as e:
                logger.error(f"Error validating sql query: {e}")
                return "SQL_VALIDATION_FAILED"
    
    