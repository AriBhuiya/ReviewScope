from abc import ABC, abstractmethod

class ScraperBase(ABC):
    @abstractmethod
    def scrape(self, app_id: str, count: int = 100) -> list:
        pass