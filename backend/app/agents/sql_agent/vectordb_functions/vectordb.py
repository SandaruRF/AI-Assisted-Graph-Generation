import chromadb
from app.utils.logging import logger

client = chromadb.Client()

collection = client.get_or_create_collection(name="summerized_logs")

def add_to_vectordb(session_id:str,summerized_logs:str):
    try:
        collection.add(
            documents=[summerized_logs],
            ids=session_id
        )
    except Exception as e:
        logger.error(f"Error adding to vectordb: {e}")









