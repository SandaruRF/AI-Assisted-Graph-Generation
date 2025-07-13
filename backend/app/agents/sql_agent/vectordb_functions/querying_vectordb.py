from math import e
import chromadb
from app.utils.logging import logger


client = chromadb.Client()


def query_vectordb(user_prompt,n=10):
    try:
        collection = client.get_collection(name="summerized_logs")
        results = collection.query(
            query_texts=[user_prompt],
            n_results=n
        )
        print("vector db query results ", results)
        return results
    except Exception as e:
        logger.error("Vector database querying fail", e)
