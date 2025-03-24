import os
from dotenv import load_dotenv
from app.agents.sql_agent.databaseApi import GLOBAL_CONNECTION_STRING
from pydantic_settings import BaseSettings
from pydantic import ConfigDict

load_dotenv()
class Settings(BaseSettings):
    # API Keys
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY")
    DATABASE_URL: str  = GLOBAL_CONNECTION_STRING or "mysql+pymysql://root:root@localhost/chinook"
    
    # App Settings
    DEBUG: bool = False  
    LOG_LEVEL: str = "INFO"

    class Config:
        env_file = ".env"  
        env_file_encoding = "utf-8"


model_config = ConfigDict(
    env_file=".env",
    env_file_encoding="utf-8"
)

settings = Settings()


DATABASE_URL = GLOBAL_CONNECTION_STRING or "mysql+pymysql://root:root@localhost/chinook"
