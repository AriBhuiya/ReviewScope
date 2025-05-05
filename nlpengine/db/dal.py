# dal.py
from abc import ABC, abstractmethod


class BaseDAL(ABC):
    """Abstract DAL interface."""

    @abstractmethod
    def get_reviews_by_app_id(self, app_id: str):
        pass

    @abstractmethod
    def insert_sentiments(self, app_id: str, sentiments: list):
        pass

    @abstractmethod
    def insert_sentiment_metadata(self, app_id: str, keywords: list, themes: list):
        pass
