# mongo.py
from datetime import datetime

from pymongo import MongoClient
from config import MONGO_URI, MONGO_DB_NAME
from db.dal import BaseDAL


class MongoDAL(BaseDAL):

    def __init__(self):
        self.client = MongoClient(MONGO_URI)
        self.db = self.client[MONGO_DB_NAME]
        self.reviews = self.db.reviews
        self.sentiments = self.db.sentiments
        self.sentiments_metadata = self.db.sentiments_metadata
        self.apps = self.db.apps

    def get_reviews_by_app_id(self, app_id: str):
        return list(self.reviews.find({"app_id": app_id}))

    def insert_sentiments(self, app_id: str, sentiments: list):
        if sentiments:
            self.sentiments.insert_many(sentiments)

    def insert_sentiment_metadata(self, app_id: str, keywords: list, themes: dict):
        metadata = {
            "app_id": app_id,
            "top_keywords": [
                {"keyword": k, "count": float(v)} for k, v in keywords
            ],
            "top_themes": [
                {"theme": theme, "count": int(count)} for theme, count in themes.items()
            ]
        }
        self.sentiments_metadata.insert_one(metadata)

    def insert_appname_cache(self, app_id: str, store: str):
        doc = {
            "app_id": app_id,
            "store": store,
            "last_updated": datetime.utcnow()
        }
        self.db.apps.insert_one(doc)
