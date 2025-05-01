from pydantic import BaseModel, Field
from enum import Enum
from typing import List, Dict
from bson import ObjectId

class DatabaseType(str, Enum):
    MYSQL = "mysql"
    POSTGRESQL = "postgresql"
    SQLSERVER = "sqlserver"
    MARIA_DB = "marinadb"
    ORACLE_DB = "oracledb"
    SQLITE = "sqlite"
    REDSHIFT = "redshift"

# Default ports mapping
DEFAULT_PORTS: Dict[DatabaseType, int] = {
    DatabaseType.MYSQL: 3306,
    DatabaseType.POSTGRESQL: 5432,
    DatabaseType.SQLSERVER: 1433,
    DatabaseType.MARIA_DB: 3308,
    DatabaseType.ORACLE_DB: 1521,
    DatabaseType.SQLITE: 0,  # No port for SQLite
    DatabaseType.REDSHIFT: 5439,
}

class Database(BaseModel):
    type: List[DatabaseType]
    host: str 
    port: int 
    user: str 
    password: str 
    database: str 
    tls_ssl: bool  
    remember: bool


    def set_default_port(self):
        """Automatically sets the default port based on the first database type."""
        if not self.port and self.type:
            self.port = DEFAULT_PORTS.get(self.type[0], 0) 

    def __init__(self, **data):
        super().__init__(**data)
        self.set_default_port()
    
    