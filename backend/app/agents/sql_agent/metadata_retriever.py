from fastapi import HTTPException
from sqlalchemy import create_engine, MetaData
from typing import List, Dict, Any
import re

from utils.logging import logger

def reflect_sql_metadata(connection_string: str) -> List[Dict[str, Any]]:
    """Reflect metadata from the database using SQLAlchemy and return a structured format."""
    engine = create_engine(connection_string)
    metadata = MetaData()
    metadata.reflect(bind=engine)

    logger.info("Database connection successful.")

    #format metadata to JSON
    if not metadata.tables:
        return []

    tables_info = []
    for table_name, table in metadata.tables.items():
        column_data = [
            {"column_name": column.name, 
            "data_type": re.sub(r' COLLATE ".*"', '', str(column.type))}
            for column in table.columns
        ]

        primary_keys = [
            pk.name for pk in table.primary_key.columns
        ]

        foreign_keys = [
            {"local_column": fk.parent.name, 
            "referenced_table": fk.column.table.name,
            "referenced_column": fk.column.name}
            for fk in table.foreign_keys
        ]

        tables_info.append({
            "table_name": table_name,
            "columns": column_data,
            "primary_keys": primary_keys,
            "foreign_keys": foreign_keys
        })

    logger.info(f"Metadata retrieved for {len(tables_info)} tables.")
    return tables_info

def get_cached_metadata(session_id:str = None) -> List[Dict[str, Any]]:
    from api.sql_database import session_store  # Lazy import
    if session_id not in session_store:
        raise HTTPException(status_code=404, detail="Session ID not found")
    metadata = session_store[session_id]["metadata"]
    return metadata