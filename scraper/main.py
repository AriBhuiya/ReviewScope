import datetime
from typing import Optional

from jobManager import JobManager
from runner import run_scraper
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
mongo_db_name = os.getenv("MONGO_DB")
queue_uri = os.getenv("QUEUE_URI")
scraper = GoogleScraper() if scraper_cfg.source == "google" else IosScraper()
storage = MongoStorage(mongo_uri, mongo_db_name)

jobmanager = JobManager(queue_uri)


def run_pipeline():
    job = jobmanager.fetch_last_queued_job()
    if not job:
        print("No Jobs available")
        return
    # Processing Stage
    job.status = "processing"
    jobmanager.update_job(job)
    try:
        reviews = run_scraper(scraper, job.app_id, count=scraper_cfg.review_count)
        if not reviews:
            raise Exception("No reviews available / invalid app id")
        storage.save(reviews, job.app_id)
        job.stage = "nlp"
        job.status = "queued"
    except Exception as e:
        job.error_message = str(e)
        job.status = "error"
        print(e)
    jobmanager.update_job(job)
    if job.status != "error":
        print("Job finished")
    else:
        print("Job failed")


run_pipeline()
