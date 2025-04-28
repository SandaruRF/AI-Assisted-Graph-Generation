import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings
from pydantic import ConfigDict

load_dotenv()

class Settings(BaseSettings):
    FRONTEND_URL: str = os.getenv("FRONTEND_URL")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY")
    MONGO_URI: str = os.getenv("MONGO_URI")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME")
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    CLICK_SEND_API: str = os.getenv("CLICK_SEND_API")
    CLICK_SEND_USERNAME: str = os.getenv("CLICK_SEND_USERNAME")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "mysql+pymysql://root:root@localhost/chinook")

    # App Settings
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

    model_config = ConfigDict(
        env_file=".env",
        env_file_encoding="utf-8"
    )

settings = Settings()