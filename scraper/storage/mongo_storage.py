from pymongo import MongoClient
from .base_storage import StorageBase

class MongoStorage(StorageBase):
    def __init__(self, uri="mongodb://localhost:27017"):
        self.client = MongoClient(uri)
        self.db = self.client.get_default_database()

    def save(self, reviews, app_id):
        self.db.reviews.insert_many(reviews)
        print(f"✅ Inserted {len(reviews)} reviews into Mongo")