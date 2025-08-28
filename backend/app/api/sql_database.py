from fastapi import APIRouter, HTTPException
from fastapi.encoders import jsonable_encoder
from bson import ObjectId
import uuid

from app.models.database_model import Database, DatabaseType
from app.agents.sql_agent.metadata_retriever import reflect_sql_metadata
from app.utils.sql_utils import generate_connection_string
from app.utils.db_host_translation import resolve_database_host
from app.utils.logging import logger
from app.config import db

#Collection 
connection_collection = db["DatabaseDetails"]

router = APIRouter()

GLOBAL_CONNECTION_STRING = None  

session_store = {}

@router.post("/connect_database/{connection_id}")
async def connect_database(connection_id: str):
    """Connects to a database using a stored connection ID."""
    global GLOBAL_CONNECTION_STRING
    logger.info(connection_id)
    try:
        # Fetch connection info from MongoDB
        connection_data = await connection_collection.find_one({"_id": ObjectId(connection_id)})
        
        connection_data.pop("_id", None)  
        connection_data.pop("form_type", None)  
        connection_data.pop("name", None)
         
        [connection_data.pop(key, None) for key in ["_id", "form_type","name"]]

        logger.info(f"Connection data: {connection_data}")
        
        if not connection_data:
            raise HTTPException(status_code=404, detail="Connection ID not found.")
        
        mapped_data = {
            "type": [DatabaseType(connection_data["db_type"].lower())],  # convert to enum
            "host": resolve_database_host(connection_data["host"]),
            "port": connection_data["port"],
            "user": connection_data["username"],
            "password": connection_data["password"],
            "database": connection_data["database"],
            "tls_ssl": connection_data["ssl"],
            "remember": connection_data["remember"]
        }

        # Generate connection string from retrieved data
        db = Database(**mapped_data)
        connection_string = generate_connection_string(db)
        GLOBAL_CONNECTION_STRING = connection_string

        tables_info = reflect_sql_metadata(connection_string)
        sql_dialect = db.type[0].name
        session_id = str(uuid.uuid4())
        session_store[session_id] = jsonable_encoder(
            {
                "metadata": tables_info, 
                "connection_string": connection_string, 
                "sql_dialect": sql_dialect
            }
        )
        return  {"session_id": session_id}
    
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))