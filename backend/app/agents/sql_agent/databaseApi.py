from fastapi import APIRouter, Depends, HTTPException
from app.models.database_model import Database, DatabaseType
from app.api.database import get_db, get_metadata

router = APIRouter()

def generate_connection_string(db: Database) -> str:
    """Generates a database connection string based on the selected database type."""
    db_type = db.type[0]  # Using the first database type from the list
    
    if db_type == DatabaseType.MYSQL:
        return f"mysql+pymysql://{db.user}:{db.password}@{db.host}:{db.port}/{db.database}"
    elif db_type == DatabaseType.POSTGRESQL:
        return f"postgresql://{db.user}:{db.password}@{db.host}:{db.port}/{db.database}"
    elif db_type == DatabaseType.SQLSERVER:
        return f"mssql+pyodbc://{db.user}:{db.password}@{db.host}:{db.port}/{db.database}?driver=SQL+Server"
    elif db_type == DatabaseType.MarinaDB:
        return f"mariadb+pymysql://{db.user}:{db.password}@{db.host}:{db.port}/{db.database}"
    elif db_type == DatabaseType.OracleDB:
        return f"oracle://{db.user}:{db.password}@{db.host}:{db.port}/{db.database}"
    elif db_type == DatabaseType.SQLite:
        return f"sqlite:///{db.database}.db"  # SQLite uses a file-based database
    elif db_type == DatabaseType.Redshift:
        return f"redshift+psycopg2://{db.user}:{db.password}@{db.host}:{db.port}/{db.database}"
    
    raise ValueError("Unsupported database type")

async def get_connection_string(db: Database) -> str:
    return generate_connection_string(db)

@router.post("/connect_database/")
async def create_database_connection(db: Database):
    try:
        connection_string = generate_connection_string(db)
        # Test database connection
        metadata = get_metadata(connection_string)  # Ensures the database is reachable

        return {
            "message": "Database connection successful",
            "connection_string": connection_string,
            "tables": list(metadata.tables.keys())  # List database tables as a response
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error connecting to database: {str(e)}")
