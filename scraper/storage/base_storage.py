from abc import ABC, abstractmethod

class StorageBase(ABC):
    @abstractmethod
    def save(self, reviews: list, app_id: str):
        pass