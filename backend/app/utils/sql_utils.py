from sqlalchemy.engine import URL
from urllib.parse import quote_plus

from app.models.database_model import Database, DatabaseType

def generate_connection_string(db: Database) -> str:
    """Generates a database connection string based on the selected database type."""
    db_type = db.type[0]
    
    if db_type == DatabaseType.MYSQL:
        return f"mysql+pymysql://{db.user}:{db.password}@{db.host}:{db.port}/{db.database}"
    elif db_type == DatabaseType.POSTGRESQL:
        return f"postgresql://{db.user}:{db.password}@{db.host}:{db.port}/{db.database}"
    elif db_type == DatabaseType.SQLSERVER:
        # For SQL Server with Windows Authentication (username contains backslash)
        if '\\' in db.user:
            # Windows Authentication - use Trusted_Connection
            driver = "ODBC Driver 17 for SQL Server"
            connection_string = (
                f"DRIVER={{{driver}}};"
                f"SERVER={db.host};"
                f"DATABASE={db.database};"
                f"Trusted_Connection=yes;"
            )
        else:
            # SQL Server Authentication
            driver = "ODBC Driver 17 for SQL Server"
            connection_string = (
                f"DRIVER={{{driver}}};"
                f"SERVER={db.host};"
                f"DATABASE={db.database};"
                f"UID={db.user};"
                f"PWD={db.password};"
            )
        
        # URL encode the connection string
        params = quote_plus(connection_string)
        return f"mssql+pyodbc:///?odbc_connect={params}"
    elif db_type == DatabaseType.MARIA_DB:
        return f"mariadb+pymysql://{db.user}:{db.password}@{db.host}:{db.port}/{db.database}"
    elif db_type == DatabaseType.ORACLE_DB:
        return f"oracle+cx_oracle://{db.user}:{db.password}@{db.host}:{db.port}/{db.database}"
    elif db_type == DatabaseType.SQLITE:
        return f"sqlite:///{db.database}.db"
    elif db_type == DatabaseType.REDSHIFT:
        return f"redshift+psycopg2://{db.user}:{db.password}@{db.host}:{db.port}/{db.database}"
    
    raise ValueError("Unsupported database type")