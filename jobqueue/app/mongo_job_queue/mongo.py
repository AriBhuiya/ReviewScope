from pymongo import MongoClient
import os

client = None
db = None

def connect():
    global client, db
    mongo_uri = os.getenv("MONGO_URI")
    db_name = os.getenv("MONGO_DB")

    if not mongo_uri or not db_name:
        raise ValueError("Missing MONGO_URI or MONGO_DB in environment.")

    client = MongoClient(mongo_uri)
    db = client[db_name]
    print(f"Connected to MongoDB database: {db.name}")
    return db

def disconnect():
    global client
    if client:
        client.close()
        print("Disconnected from MongoDB")

def get_collection(name: str):
    if db is None:
        raise RuntimeError("MongoDB not connected")
    return db[name]