from runner import run_scraper
from scraper.storage.base_storage import StorageBase
from scrapers.google_scrapper import GoogleScraper
from scrapers.ios_scrapper import IosScraper
from storage.mongo_storage import MongoStorage
from config import load_config
import os
from dotenv import load_dotenv
from collections import namedtuple

config = load_config()
load_dotenv()

ScraperConfig = namedtuple("ScraperConfig", ["source", "lang", "country", "review_count", "sort_by"])
scraper_cfg = ScraperConfig(
    source=config["scraper"]["source"],
    lang=config["scraper"]["lang"],
    country=config["scraper"]["country"],
    review_count=config["scraper"]["review_count"],
    sort_by=config["scraper"].get("sort_by", "most_relevant")
)

mongo_uri = os.getenv("MONGO_URI")
app_id = "com.spotify.music"

scraper = GoogleScraper() if scraper_cfg.source == "google" else IosScraper()

storage = MongoStorage(mongo_uri)

class FakeMongoStorage(StorageBase):
    def save(self, reviews: list, app_id: str):
        print(reviews)

#storage = FakeMongoStorage()

run_scraper(scraper, storage, app_id, count=scraper_cfg.review_count)