from sqlalchemy.engine import URL

from app.models.database_model import Database, DatabaseType

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