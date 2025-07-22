import os
# import google.generativeai as genai
from anthropic import Anthropic
import json

from app.config import settings
from app.utils.logging import logger

class IntentClassifier:
    def __init__(self):
        # genai.configure(api_key=settings.GOOGLE_API_KEY)
        # self.model = genai.GenerativeModel("gemini-2.0-flash")
        self.client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        self.model = "claude-3-5-sonnet-20241022"
    
    def classify_intent(self, query: str) -> dict:
        prompt = f"""
        Classify the intent(s) of the following user query. The query may involve one or more intents.
        Query: "{query}"
        
        Available intents: visualization, insight, explanation, schema, exploratory, system, customization, other.

        **CRITICAL DECISION LOGIC FOR SCHEMA vs EXPLORATORY:**
        
        The system has access to database metadata containing ONLY structural information:
        - Database name and table names
        - Column names and data types (integer, text, datetime, etc.)
        - Primary keys and foreign key relationships
        - Column categorization (numeric, categorical, temporal, text)
        - Row counts per table
        - Sample data structure (field names and example values)
        - Database dialect information
        
        **KEY DISTINCTION:**
        - **SCHEMA**: Questions about database STRUCTURE and ORGANIZATION
        - **EXPLORATORY**: Questions about actual DATA CONTENT and VALUES

        **Use "schema" intent IF the query asks about database structure/metadata only.**
        **Use "exploratory" intent IF the query asks for actual data records, values, or content.**

        Intent Classifications:

        - **schema**: Questions about database structure that can be answered from metadata alone:
            ✅ "What tables are in the database?"
            ✅ "What columns are in the 'customer' table?"
            ✅ "What is the primary key of the invoice table?"
            ✅ "Which columns are temporal/numeric/text?"
            ✅ "How are the album and artist tables related?"
            ✅ "What data type is the Total column?"
            ✅ "How many rows are in the track table?" (row count is in metadata)
            ✅ "Show me sample data from the employee table" (sample structure is in metadata)
            ✅ "What are the foreign key relationships?"
            ✅ "Which tables have the most columns?"

        - **exploratory**: Questions requiring actual data retrieval via SQL queries:
            ✅ "What is the average Total in the invoice table?"
            ✅ "List all artist names that start with 'A'"
            ✅ "List all the artists in the db"                    
            ✅ "Show me all customers from Brazil"                
            ✅ "List all albums by AC/DC"                         
            ✅ "What are all the genres in the database?"         
            ✅ "Show me all invoice dates"                        
            ✅ "List all track names"                             
            ✅ "What are the top 10 customers by spending?"
            ✅ "What is the most common value in the country column?"
            ✅ "Show me all invoices from 2023"
            ✅ "How many customers are from each country?"
            ✅ "What is the median track duration?"
            ✅ "Display the first 5 rows of the customer table"   
            ✅ "What are all the unique cities in the database?"  

        **IMPORTANT DISTINCTIONS:**
        - "What tables exist?" = SCHEMA (structure)
        - "List all artists" = EXPLORATORY (actual data content)
        - "What columns are in artist table?" = SCHEMA (structure)
        - "Show me artist names" = EXPLORATORY (actual data content)
        - "How many rows in total?" = SCHEMA (count is in metadata)
        - "Show me the actual rows" = EXPLORATORY (actual data content)

        **Decision Process:**
        1. Does the query ask for actual data records, values, or content? → EXPLORATORY
        2. Does the query ask about database structure, organization, or metadata? → SCHEMA
        3. Does the query use words like "list all", "show me", "display", "what are the" when referring to actual data? → EXPLORATORY
        4. Does the query ask "what exists" vs "show me what exists"? → SCHEMA vs EXPLORATORY

        - **visualization**: User wants to generate charts, graphs, or visual representations of data.
        - **insight**: User wants to discover trends, anomalies, patterns, or correlations in the data.
        - **explanation**: User wants explanations about discovered insights or data patterns.
        - **customization**: User wants to modify existing visualizations (colors, filters, chart types).
        - **system**: User wants to connect to different databases, export data, or share results.
        - **other**: Queries that don't fit the above categories.

        Return a JSON object with this exact structure:
        {{
            "intent": ["intent1", "intent2"],
            "confidence": 0.95,
            "reason": ["reason for intent1", "reason for intent2"]
        }}

        Ensure valid JSON format with no extra text or markdown.
        """
        
        try:
            # response = self.model.generate_content(prompt)
            response = self.client.messages.create(
                model=self.model,
                max_tokens=1000,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            if not response or not response.content:
                logger.error("Error: Received an empty response from Gemini API.")
                return {"intent": "unknown", "confidence": 0.0}

            # result = response.text.strip()
            result = response.content[0].text.strip()
            result = result.replace("```json", "").replace("```", "").strip()
            logger.info(f"Gemini Response: {result}")

            try:
                parsed_result = json.loads(result)
                if "intent" in parsed_result and "confidence" in parsed_result:
                    return parsed_result
            except json.JSONDecodeError as e:
                logger.error(f"JSON Parsing Error: {e}")

            return {"intent": "unknown", "confidence": 0.0}

        except Exception as e:
            logger.error(f"Error classifying intent: {e}")
            return {"intent": "unknown", "confidence": 0.0}
        