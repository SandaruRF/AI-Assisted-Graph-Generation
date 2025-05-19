import os
from pathlib import Path

from dotenv import load_dotenv
from pydantic_settings import BaseSettings
from pydantic import ConfigDict
from motor.motor_asyncio import AsyncIOMotorClient


BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"

MODEL_PATH = MODEL_DIR / "graph_model.json"
PCA_PATH = MODEL_DIR / "pca_model.joblib"
LABEL_ENCODER_PATH = MODEL_DIR / "label_encoder.joblib"
FEATURE_COLUMNS_PATH = MODEL_DIR / "feature_columns.joblib"

load_dotenv()

class Settings(BaseSettings):
    FRONTEND_URL: str = os.getenv("FRONTEND_URL")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY")
    MONGO_URI: str = os.getenv("MONGO_URI")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME")
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    CLICK_SEND_API: str = os.getenv("CLICK_SEND_API")
    CLICK_SEND_USERNAME: str = os.getenv("CLICK_SEND_USERNAME")
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET")
    GITHUB_CLIENT_ID: str = os.getenv("GITHUB_CLIENT_ID")
    GITHUB_CLIENT_SECRET: str = os.getenv("GITHUB_CLIENT_SECRET")
   

    
    # App Settings
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

    model_config = ConfigDict(
        env_file=".env",
        env_file_encoding="utf-8"
    )

settings = Settings()


client = AsyncIOMotorClient(settings.MONGO_URI)
db = client[settings.DATABASE_NAME]
