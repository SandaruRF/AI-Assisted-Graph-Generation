from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from app.api.database import get_db
from app.services.text_to_sql_service import generate_sql_query

router = APIRouter()

@router.get("/sql_query")
async def get_sql_query(db: Session = Depends(get_db), nl_query: str = None):
    try:
        nl_query = nl_query #user NL Query
        sql_query = await generate_sql_query(db, nl_query)
        if not sql_query:
            raise HTTPException(status_code=400, detail="Failed to generate SQL query.")
        
        result = db.execute(text(sql_query))
        data = result.fetchall()

        columns = result.keys()
        records = [dict(zip(columns, row)) for row in data]

        return {"query": sql_query, "data": records}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating SQL query: {str(e)}")