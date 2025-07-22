# import google.generativeai as genai
from anthropic import Anthropic
import json

from app.config import settings
from app.utils.logging import logger
from app.state import State

class MetadataExpert:
    def __init__(self):
        # genai.configure(api_key=settings.GOOGLE_API_KEY)
        # self.model = genai.GenerativeModel("gemini-2.0-flash")
        self.client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        self.model = "claude-3-5-sonnet-20241022"
    
    def answer_schema_question(self, state: State) -> str:
        """
        Answers user questions about the database schema using the provided metadata.
        It identifies what can and cannot be answered and responds accordingly.
        """
        
        # Extract the actual schema and dialect from the state object
        schema_data = state.metadata
        sql_dialect = state.metadata.get('connection_info', {}).get('dialect', 'Unknown')
        
        # Convert the schema dictionary to a formatted JSON string for the prompt
        try:
            metadata_json = json.dumps(schema_data, indent=2)
        except Exception:
            metadata_json = str(schema_data)
        # --- END OF CORRECTION ---

        prompt = f"""
        You are an intelligent database assistant. Your role is to help users understand their database schema based on the metadata provided.

        **SQL Dialect:** {sql_dialect}

        **Database Metadata:**
        ```
        {metadata_json}
        ```

        **User's Question:**
        "{state.user_prompt}"

        ---
        **Your Instructions:**

        1.  **Analyze the User's Question:** Carefully determine if the question can be answered using ONLY the **Database Metadata** provided above.

        2.  **If the question CAN be answered from the metadata:**
            - Provide a clear, direct, and accurate answer.
            - Use Markdown formatting (like bullet points, bold text, and code blocks) to make the response easy to read and professional.
            - **Example questions you CAN answer:**
              - "What tables are in the database?"
              - "Show me the columns for the 'customer' table."
              - "What is the data type of the 'Total' column in the 'invoice' table?"
              - "How are the 'album' and 'artist' tables related?"
              - "How many rows are in the 'track' table?"

        3.  **If the question CANNOT be answered from the metadata:**
            - Politely state that the question cannot be answered with the available schema information.
            - Briefly explain **why**. Common reasons are that it requires running a query on the live data, analyzing data content, or understanding business context not present in the schema.
            - **Suggest an alternative, related question** that *could* be answered from the metadata.
            - **Example questions you CANNOT answer:**
              - "What is the average invoice total?" (Requires query execution)
              - "Which country has the most customers?" (Requires data analysis)
              - "What is the purpose of the 'employee' table?" (Requires business context)

        4.  **Tone:** Be helpful, professional, and clear. Do not invent information. Your knowledge is strictly limited to the JSON metadata above.
        ---
        """
        
        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=1000,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            return response.content[0].text if response else "I'm sorry, I couldn't process that request. Could you please ask a question about the database structure?"

        except Exception as e:
            logger.error(f"Error generating metadata response: {e}")
            return "I'm sorry, I encountered an error while trying to analyze the database metadata. Please try again."


    def answer_exploratory_question(self, state: State) -> str:
            """
            Answers user questions about actual data content using the retrieved data.
            Handles exploratory queries that require data analysis and presentation.
            """
            
            prompt = f"""
            You are an intelligent data analyst. Your role is to help users understand their data by answering questions about the actual data content.

            **User's Question:**
            "{state.user_prompt}"

            **SQL Query Executed:**
            ```
            {state.sql_query}
            ```

            **Data Retrieved:**
            {state.original_data}

            ---
            **Your Instructions:**

            1. **Analyze the User's Question:** Understand what specific information the user is looking for from the data.

            2. **Process the Data:** Use the retrieved data to answer the user's question accurately.

            3. **Format Your Response:**
            - Provide a clear, direct answer to the user's question
            - Use Markdown formatting (tables, bullet points, bold text) for readability
            - Present data in a structured format when appropriate
            - Include relevant statistics or summaries when helpful

            4. **Handle Different Query Types:**
            - **List queries**: Present data in organized lists or tables
            - **Statistical queries**: Provide calculations with context
            - **Filter queries**: Show relevant subset of data
            - **Aggregation queries**: Present summaries with explanations

            5. **Data Presentation Guidelines:**
            - If showing many rows, limit to most relevant ones and mention the total count
            - For numerical data, provide context (min, max, average when relevant)
            - Use proper formatting for different data types (dates, currencies, etc.)
            - Group similar data when it makes sense

            6. **Tone:** Be helpful, professional, and clear. Base your response entirely on the data provided.

            **Example Response Formats:**
            - For "List all artists": Create a formatted list or table
            - For "Average invoice total": Show calculation with context
            - For "Top 10 customers": Present ranked data in table format
            - For "Most common country": Show frequency analysis

            **Give nice, structured responses based on the data provided. Do not repeat user query and sql query executed in the response unless it's necessary**
            ---
            """
            
            try:
                response = self.client.messages.create(
                model=self.model,
                max_tokens=1000,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
                return response.content[0].text if response else "I'm sorry, I couldn't process the data to answer your question. Please try again."

            except Exception as e:
                logger.error(f"Error generating exploratory response: {e}")
                return "I'm sorry, I encountered an error while analyzing the data. Please try again."
