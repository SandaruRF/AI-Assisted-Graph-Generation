from fastapi import APIRouter, Depends, HTTPException
from app.models.database_model import Database
from app.models.database_model import DatabaseType

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
    
    return "Unsupported database type"

@router.post("/get_database/")
async def create_database_connection(db: Database):
    connection_string = generate_connection_string(db)
    return {
        "message": "Database connection string generated successfully",
        "connection_string": connection_string
    }