from fastapi import APIRouter, HTTPException
from sqlalchemy import create_engine, MetaData
from sqlalchemy.engine import URL
from app.models.database_model import Database, DatabaseType
from app.utils.logging import logger
import json

router = APIRouter()

GLOBAL_CONNECTION_STRING = None  

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

@router.post("/connect_database/")
async def create_database_connection(db: Database):
    """Creates a database connection and stores it globally."""
    global GLOBAL_CONNECTION_STRING
    try:
        connection_string = generate_connection_string(db)
        GLOBAL_CONNECTION_STRING = connection_string 

        # Test connection
        engine = create_engine(connection_string)
        metadata = MetaData()
        metadata.reflect(bind=engine)

        logger.info("Database connection successful.")
        return {
            "message": "Database connection successful",
            "connection_string": connection_string,
            "tables": list(metadata.tables.keys())
        }
    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Invalid JSON input: {str(e)}")
    except Exception as e:
        logger.error(f"Database connection error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error connecting to database: {str(e)}")
