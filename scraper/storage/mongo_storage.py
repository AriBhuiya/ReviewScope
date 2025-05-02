from pymongo import MongoClient
from .base_storage import StorageBase


class MongoStorage(StorageBase):
    def __init__(self, uri:str, db_name:str):
        self.client = MongoClient(uri)
        self.db = self.client[db_name]

    def save(self, reviews, app_id):
        self.db.reviews.insert_many(reviews)
        print(f"✅ Inserted {len(reviews)} reviews into Mongo")
