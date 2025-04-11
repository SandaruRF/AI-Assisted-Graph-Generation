from pydantic import BaseModel

class DatabaseConnection(BaseModel):
    name: str
    db_type: str
    host: str
    port: int
    database: str
    username: str
    password: str
    ssl: bool
    remember: bool

class ConnectionString(BaseModel):
    name: str
    db_type: str
    connection_string: str
    ssl: bool
    remember: bool
