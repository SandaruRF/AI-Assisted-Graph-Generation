from pydantic import BaseModel
from enum import Enum

class DatabaseType(str, Enum):
    MYSQL = "mysql"
    POSTGRESQL = "postgresql"
    SQLSERVER = "sqlserver"
    MarinaDB = "marinadb"
    OracleDB = "oracledb"
    SQLite = "sqlite"
    Redshift = "redshift"


class Database(BaseModel):
    type: list[DatabaseType]
    host: str
    port: int
    user: str
    password: str
    database: str
    