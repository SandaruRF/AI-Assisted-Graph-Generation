
from pydantic import BaseModel, Field
from typing import Optional
class ConnectionData(BaseModel):
    name: str
    db_type: str
    host: str
    port: int
    database: str
    username: str
    password: str
    ssl: bool
    remember: bool

# Step 4b: Model for Connection String Form
class ConnectionStringData(BaseModel):
    name: str
    db_type: str
    connection_string: str
    ssl: Optional[bool] = False
    remember: Optional[bool] = False