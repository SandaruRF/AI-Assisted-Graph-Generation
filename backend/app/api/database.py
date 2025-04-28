from fastapi import APIRouter, HTTPException
from models.connection_form import ConnectionData, ConnectionStringData
from config import settings
from pymongo import MongoClient
from bson import ObjectId
from typing import  Union
from utils.logging import logger



client = MongoClient(settings.MONGO_URI)
db = client[settings.DATABASE_NAME]
connections_collection = db["DatabaseDetails"]

router = APIRouter()

@router.post("/connections")
async def save_connection_form(connection: ConnectionData):
    try:
        data = connection.dict()
        data["form_type"] = "detailed_form"
        result = connections_collection.insert_one(data)
        return {
            "status": "success",
            "form": "detailed_form",
            "id": str(result.inserted_id),
            "connection_name": connection.name
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/connection-strings")  # Adjusted to avoid duplicate prefix
async def save_connection_string_form(data: ConnectionStringData):
    try:
        data_dict = data.dict()
        logger.info(f"Received connection string data: {data_dict}")
        if not data_dict.get("ssl"):
            data_dict["ssl"] = False
        data_dict["form_type"] = "connection_string_form"
        result = connections_collection.insert_one(data_dict)
        return {
            "status": "success",
            "form": "connection_string_form",
            "id": str(result.inserted_id),
            "connection_name": data.name
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/connections")
async def get_connections():
    try:
        connections = list(connections_collection.find())
        for conn in connections:
            conn["_id"] = str(conn["_id"])
        return connections
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/connections/{connection_id}")
async def get_connection_by_id(connection_id: str):
    try:
        if not ObjectId.is_valid(connection_id):
            raise HTTPException(status_code=400, detail="Invalid connection ID format")

        connection = connections_collection.find_one({"_id": ObjectId(connection_id)})

        if not connection:
            raise HTTPException(status_code=404, detail="Connection not found")

        connection["_id"] = str(connection["_id"])
        return connection
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/connections/{connection_id}")
async def update_connection(connection_id: str, updated_connection: Union[ConnectionData, ConnectionStringData]):
    try:
        if not ObjectId.is_valid(connection_id):
            raise HTTPException(status_code=400, detail="Invalid connection ID format")

        updated_data = updated_connection.dict(exclude_unset=True)

        # Detect the form type
        if isinstance(updated_connection, ConnectionData):
            updated_data["form_type"] = "detailed_form"
        elif isinstance(updated_connection, ConnectionStringData):
            updated_data["form_type"] = "connection_string_form"

        logger.info(f"Updating connection {connection_id} with data: {updated_data}")

        result = connections_collection.update_one(
            {"_id": ObjectId(connection_id)},
            {"$set": updated_data}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Connection not found")

        return {
            "status": "success",
            "message": f"Connection {connection_id} successfully updated"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/connections/{connection_id}")
async def delete_connection(connection_id: str):
    try:
        if not ObjectId.is_valid(connection_id):
            raise HTTPException(status_code=400, detail="Invalid connection ID format")

        result = connections_collection.delete_one({"_id": ObjectId(connection_id)})
        
        if result.deleted_count == 1:
            return {"status": "success", "message": f"Connection {connection_id} successfully deleted"}
        else:
            raise HTTPException(status_code=404, detail="Connection not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

        
from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker, close_all_sessions
from sqlalchemy.exc import SQLAlchemyError
from config import DATABASE_URL
from utils.logging import logger


def create_dynamic_engine(connection_string: str):
    """Creates a new SQLAlchemy engine dynamically based on user input."""
    if not connection_string:
        logger.error("Connection string cannot be empty.")
        raise ValueError("Invalid database connection string.")

    try:
        engine = create_engine(connection_string, pool_pre_ping=True)
        logger.info("Database engine created successfully.")
        return engine
    except SQLAlchemyError as e:
        logger.error(f"Error creating engine: {str(e)}")
        raise RuntimeError("Error initializing database engine.")
    
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_metadata(*args):
    try:
        metadata = MetaData()
        metadata.reflect(engine)
        logger.info("Metadata retrieved successfully.")
        return metadata
    except SQLAlchemyError as e:
        logger.error(f"Error reflecting metadata: {str(e)}")
        raise RuntimeError("Error retrieving database metadata.")

#DATABASE_URL = GLOBAL_CONNECTION_STRING
if DATABASE_URL is None:
    logger.error("DATABASE_URL environment variable is not set!")
    raise ValueError("DATABASE_URL environment variable is not set!")

logger.info(f"Using database URL: {DATABASE_URL}")

# Close all previous database sessions to ensure no lingering connections
close_all_sessions()

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

