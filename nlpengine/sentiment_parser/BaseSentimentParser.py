from abc import ABC, abstractmethod


class BaseSentimentParser(ABC):
    @abstractmethod
    def predict(self, reviews: list) -> list:
        pass
