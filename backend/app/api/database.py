from fastapi import APIRouter, HTTPException
from app.models.database_connection import DatabaseConnection, ConnectionString
from pymongo import MongoClient
import os

router = APIRouter()

# MongoDB Atlas connection
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["VizGen"]

# Two collections: one for connection form, one for connection string
form_collection = db["connections"]
string_collection = db["connectionStrings"]

@router.post("/connections/form")
async def save_form_connection(connection: DatabaseConnection):
    try:
        result = form_collection.insert_one(connection.dict())
        return {"status": "success", "id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/connections/string")
async def save_string_connection(connection: ConnectionString):
    try:
        result = string_collection.insert_one(connection.dict())
        return {"status": "success", "id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
