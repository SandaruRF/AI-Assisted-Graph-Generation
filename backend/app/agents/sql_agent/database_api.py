from fastapi import APIRouter, HTTPException
import re
from sqlalchemy.engine import URL
from models.database_model import Database, DatabaseType
from sqlalchemy import create_engine, MetaData
from utils.logging import logger
from config import db
from bson import ObjectId
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.ext.automap import automap_base
import json
import uuid

#Collection 
connection_collection = db["DatabaseDetails"]

router = APIRouter()

GLOBAL_CONNECTION_STRING = None  


session_store = {}

def generate_connection_string(db: Database) -> str:
    """Generates a database connection string based on the selected database type."""
    db_type = db.type[0]
    
    if db_type == DatabaseType.MYSQL:
        return f"mysql+pymysql://{db.user}:{db.password}@{db.host}:{db.port}/{db.database}"
    elif db_type == DatabaseType.POSTGRESQL:
        return f"postgresql://{db.user}:{db.password}@{db.host}:{db.port}/{db.database}"
    elif db_type == DatabaseType.SQLSERVER:
        driver = "{ODBC Driver 17 for SQL Server}"
        connection_details = f"DRIVER={driver};SERVER={db.host};PORT={db.port};DATABASE={db.database};UID={db.user};PWD={db.password}"
        return URL.create("mssql+pyodbc", query={"odbc_connect": connection_details.replace(';', '&')})
    elif db_type == DatabaseType.MARIA_DB:
        return f"mariadb+pymysql://{db.user}:{db.password}@{db.host}:{db.port}/{db.database}"
    elif db_type == DatabaseType.ORACLE_DB:
        return f"oracle+cx_oracle://{db.user}:{db.password}@{db.host}:{db.port}/{db.database}"
    elif db_type == DatabaseType.SQLITE:
        return f"sqlite:///{db.database}.db"
    elif db_type == DatabaseType.REDSHIFT:
        return f"redshift+psycopg2://{db.user}:{db.password}@{db.host}:{db.port}/{db.database}"
    
    raise ValueError("Unsupported database type")

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
            "host": connection_data["host"],
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

        # Test connection
        engine = create_engine(connection_string)
        metadata = MetaData()
        metadata.reflect(bind=engine)

         

        

        logger.info("Database connection successful.")

        #format metadata to JSON
        if not metadata.tables:
            return {"metadata": [], "message": "No tables found in the database."}

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
        session_id = str(uuid.uuid4())
        session_store[session_id] = jsonable_encoder({"metadata": tables_info,"connection_string": connection_string})


        return  {"session_id": session_id}
    

    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Invalid JSON input: {str(e)}")
    except Exception as e:
        logger.error(f"Database connection error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error connecting to database: {str(e)}")
    


