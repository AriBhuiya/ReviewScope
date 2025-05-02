# mongo.py
from pymongo import MongoClient
from config import MONGO_URI, MONGO_DB_NAME
from db.dal import BaseDAL


class MongoDAL(BaseDAL):

    def __init__(self):
        self.client = MongoClient(MONGO_URI)
        self.db = self.client[MONGO_DB_NAME]
        self.reviews = self.db.reviews
        self.sentiments = self.db.sentiments

    def get_reviews_by_app_id(self, app_id: str):
        return list(self.reviews.find({"app_id": app_id}))

    def insert_sentiments(self, app_id: str, sentiments: list):
        if sentiments:
            self.sentiments.insert_many(sentiments)
