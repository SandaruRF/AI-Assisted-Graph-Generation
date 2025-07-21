import os
from pathlib import Path

from dotenv import load_dotenv
from pydantic_settings import BaseSettings
from pydantic import ConfigDict
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ASCENDING


BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"

MODEL_PATH = MODEL_DIR / "graph_model.json"
PCA_PATH = MODEL_DIR / "pca_model.joblib"
LABEL_ENCODER_PATH = MODEL_DIR / "label_encoder.joblib"
FEATURE_COLUMNS_PATH = MODEL_DIR / "feature_columns.joblib"

load_dotenv()

class Settings(BaseSettings):
    FRONTEND_URL: str = os.getenv("FRONTEND_URL")
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY")
    MONGO_URI: str = os.getenv("MONGO_URI")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME")
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    CLICK_SEND_API: str = os.getenv("CLICK_SEND_API")
    CLICK_SEND_USERNAME: str = os.getenv("CLICK_SEND_USERNAME")
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET")
    GITHUB_CLIENT_ID: str = os.getenv("GITHUB_CLIENT_ID")
    GITHUB_CLIENT_SECRET: str = os.getenv("GITHUB_CLIENT_SECRET")
    TAVILY_API_KEY: str = os.getenv("TAVILY_API_KEY")
   

    
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

# Add conversation collection
conversation_collection = db["conversations"]

# Create indexes for better performance
async def create_conversation_indexes():
    await conversation_collection.create_index([
        ("session_id", ASCENDING),
        ("prompt_index", ASCENDING)
    ], unique=True)
    
    await conversation_collection.create_index([("session_id", ASCENDING)])
    await conversation_collection.create_index([("created_at", ASCENDING)])