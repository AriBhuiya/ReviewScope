import os

from db.mongo import MongoDAL
from jobManager import JobManager
from keyword_parsers.KeywordParser import KeywordParser
from sentiment_parser.HuggingfaceSentimentParser import HuggingfaceSentimentParser
from sentiment_parser.vader_parser import VaderSentimentParser
from config import MODEL
from theme_parser.ThemeParser import ThemeParser
from dotenv import load_dotenv

load_dotenv()
queue_uri = os.getenv("QUEUE_URI")


class SentimentParser:
    def __init__(self, dal=MongoDAL):
        self.dal = dal()
        match MODEL:
            case "VADER":
                parser = VaderSentimentParser()
            case "HUGGINGFACE":
                parser = HuggingfaceSentimentParser()
            case _:
                parser = VaderSentimentParser()
        print(f"Using {MODEL}")
        self.parser = parser

    def fetch_reviews(self, app_id):
        return self.dal.get_reviews_by_app_id(app_id)

    # Process Sentiments
    def process_reviews(self, reviews):
        sentiments = self.parser.predict(reviews)
        return sentiments

    def get_top_keywords(self, keyword_parser: KeywordParser, reviews, n_count=20):
        keywords = keyword_parser.parse_and_get_top_keywords(reviews, n_count)
        return keywords

    def get_top_themes(self, theme_parser: ThemeParser, reviews):
        themes = theme_parser.parse_themes(reviews)
        return themes


sp = SentimentParser()
kp = KeywordParser()
tp = ThemeParser()


def run_pipeline():
    jobmanager = JobManager(queue_uri)
    job = jobmanager.fetch_last_queued_job()
    if not job:
        print("No Jobs available")
        return
    # Processing Stage
    job.status = "processing"
    jobmanager.update_job(job)
    try:
        reviews = sp.fetch_reviews(job.app_id)
        if not reviews:
            raise Exception("No reviews available")
        keywords = sp.get_top_keywords(kp, reviews)
        themes = sp.get_top_themes(tp, reviews)
        sentiments = sp.process_reviews(reviews)
        if not sentiments or not keywords or not themes:
            raise Exception("No reviews available / failed during keyword or theme extraction")
        sp.dal.insert_sentiments(job.app_id, sentiments)
        sp.dal.insert_sentiment_metadata(job.app_id, keywords, themes)
        job.stage = "done"
        job.status = "completed"
        sp.dal.insert_appname_cache(job.app_id, "google")  # hardcoded as info not available in current infra.
    except Exception as e:
        job.error_message = str(e)
        job.status = "error"
        print(e)
        raise e
    jobmanager.update_job(job)
    if job.status != "error":
        print("Job finished")
    else:
        print("Job failed")


if __name__ == '__main__':
    run_pipeline()
