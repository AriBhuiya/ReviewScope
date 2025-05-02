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
