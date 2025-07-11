import chromadb

# Create or connect to the default Chroma database
client = chromadb.Client()

# List all collections
collections = client.list_collections()
print("Collections:")
for collection in collections:
    print(f"- {collection.name}")


collection = client.get_collection(name="summerized_logs")  # replace with your collection name

# View all items in the collection
items = collection.get()  # You can also filter: collection.get(ids=["id1", "id2"])
print("Items:")
print(items)
