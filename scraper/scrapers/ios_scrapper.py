from .base_scrapper import ScraperBase

class IosScraper(ScraperBase):
    def scrape(self, app_id, count=100):
        return [
            {
                "review_id": f"mock-ios-{i}",
                "app_id": app_id,
                "text": f"Mock iOS review #{i}",
                "rating": 5,
                "timestamp": "2025-04-18T00:00:00Z",
                "version": "1.0.0"
            }
            for i in range(count)
        ]
