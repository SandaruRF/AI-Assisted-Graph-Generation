import google.generativeai as genai


from app.config import settings
from app.utils.logging import logger


from app.config import db
from app.agents.sql_agent.vectordb_functions.vectordb import add_to_vectordb



    


class LogSummerizer:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel("gemini-2.0-flash")
    
    def summarize_logs(self, metadata, sql_query):
        
        
        prompt = f"""
                        You are a helpful assistant that can help document SQL queries.

                Please document below SQL query by the given table schemas.

                ===SQL Query
                {sql_query}

                ===Table Schemas
                {metadata}

                ===Response Guidelines
                Please provide the following list of descriptions for the query:
                -The selected columns and their description
                -The input tables of the query and the join pattern
                -Query's detailed transformation logic in plain english, and why these transformation are necessary
                -The type of filters performed by the query, and why these filters are necessary
                -Write very detailed purposes and motives of the query in detail
                -Write possible business and functional purposes of the query
        """
        response = self.model.generate_content(prompt)
        logger.info(f"Summerized logs: {response.text}")
        return response.text


def query_log_summerizer(session_id: str, metadata, sql_query):
    print("WTF session id ", session_id)
    previous_query_log = db["sql_query_log"]
    previous_queries = previous_query_log.find_one({"session_id": session_id})
    logger.info("query log data retrever", previous_queries)
    log_summerizer = LogSummerizer()
    summerized_logs = log_summerizer.summarize_logs( metadata, sql_query)
    logger.info("summerized queries", summerized_logs) 
    add_to_vectordb(session_id,summerized_logs)