import chromadb


client = chromadb.Client()

collection = client.get_collection(name="summerized_logs")

def query_vectordb(user_prompt,n):
    results = collection.query(
        query_texts=[user_prompt],
        n_results=n
    )
