import chromadb


client = chromadb.Client()

collection = client.get_or_create_collection(name="summerized_logs")

def add_to_vectordb(session_id:str,summerized_logs:str):
    collection.add(
        documents=[summerized_logs],
        ids=session_id
    )









