from fastapi import APIRouter, HTTPException
from sqlalchemy.sql import text
from sqlalchemy import create_engine





# async def get_sql_query( nl_query: str = None,session_id:str = None):
#     if session_id not in session_store:
#         raise HTTPException(status_code=404, detail="Session ID not found")
#     metadata = session_store[session_id]["metadata"]
#     connection_string = session_store[session_id]["connection_string"]
    
#     try:
#         nl_query = nl_query 
#         sql_query = await generate_sql_query(metadata, nl_query)
#         if not sql_query:
#             raise HTTPException(status_code=400, detail="Failed to generate SQL query.")
#         engine = create_engine(connection_string)
#         db = engine.connect()

#         result = db.execute(text(sql_query))
#         data = result.fetchall()

#         columns = result.keys()
#         records = [dict(zip(columns, row)) for row in data]

#         return {"query": sql_query, "data": records}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error generating SQL query: {str(e)}")