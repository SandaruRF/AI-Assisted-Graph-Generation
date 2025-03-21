import google.generativeai as genai
from sqlalchemy.orm import Session
from app.agents.sql_agent.metadata import get_db_metadata
import re
from app.config import GEMINI_API
from app.utils.logging import logger

client = genai.configure(api_key=GEMINI_API)

async def generate_sql_query(db: Session, nl_query):
    schema_info = await get_db_metadata(db)

    prompt = f"""Convert the following natural language query into an optimized SQL query.

    Schema:
    {schema_info}

    Query:
    {nl_query}

    SQL Query:"""
    model = genai.GenerativeModel(model_name='gemini-1.5-flash')
    response = model.generate_content(prompt)
    

    sql_query = re.sub(r"```sql|```", "", response.text).strip()
    sql_query = sql_query.replace("\n", " ")
    logger.info("SQL query generated successfully.")
    return sql_query