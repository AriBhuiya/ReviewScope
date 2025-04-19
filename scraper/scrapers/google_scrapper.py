from google_play_scraper import reviews, Sort
from .base_scrapper import ScraperBase


class GoogleScraper(ScraperBase):
    def scrape(self, app_id, count=100):
        result, _ = reviews(
            app_id, lang='en', country='us', sort=Sort.NEWEST, count=count
        )
        return [
            {
                "review_id": r["reviewId"],
                "app_id": app_id,
                "text": r["content"],
                "rating": r["score"],
                "timestamp": r["at"].isoformat(),
                "version": r.get("reviewCreatedVersion")
            }
            for r in result
        ]