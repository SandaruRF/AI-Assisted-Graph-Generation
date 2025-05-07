from fastapi import HTTPException
from sqlalchemy.sql import text
from sqlalchemy import create_engine
from typing import List, Dict, Any

from api.sql_database import session_store

def execute_query_with_session(session_id:str, sql_query:str) -> List[Dict[str, Any]]:
    if session_id not in session_store:
        raise HTTPException(status_code=404, detail="Session ID not found")
    
    connection_string = session_store[session_id]["connection_string"]
    
    try:
        engine = create_engine(connection_string)
        db = engine.connect()

        result = db.execute(text(sql_query))
        data = result.fetchall()

        columns = result.keys()
        records = [dict(zip(columns, row)) for row in data]

        return records
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating SQL query: {str(e)}")