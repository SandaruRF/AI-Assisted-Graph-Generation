import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings
from pydantic import ConfigDict

load_dotenv()

class Settings(BaseSettings):
    # API Keys

    # App Settings
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

    model_config = ConfigDict(
        env_file=".env",
        env_file_encoding="utf-8"
    )

settings = Settings()




load_dotenv(override=True)
DATABASE_URL = os.getenv('DATABASE_URL')
GEMINI_API = os.getenv('GEMINI_API')
if not DATABASE_URL:
    DATABASE_URL = "mysql+pymysql://root:200266@localhost/chinook"
