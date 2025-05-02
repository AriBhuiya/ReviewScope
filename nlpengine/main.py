from db.mongo import MongoDAL
from keyword_parsers.KeywordParser import KeywordParser
from sentiment_parser.HuggingfaceSentimentParser import HuggingfaceSentimentParser
from sentiment_parser.vader_parser import VaderSentimentParser
import pandas as pd
from config import MODEL
from theme_parser.ThemeParser import ThemeParser


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
        self.parser = parser

    def fetch_reviews(self, app_id):
        return self.dal.get_reviews_by_app_id(app_id)

    # Process Sentiments and inserts directly to DB
    def process_reviews(self, app_id, reviews):
        sentiments = self.parser.predict(reviews)
        # print(sentiments)
        self.dal.insert_sentiments(app_id, sentiments)
        df = pd.DataFrame(sentiments)
        df.to_csv("test.csv", index=False)

    # Generates Keywords and inserts directly to DB
    def get_top_keywords(self, keyword_parser:KeywordParser, app_id, reviews, n_count=20):
        keywords = keyword_parser.parse_and_get_top_keywords(reviews, n_count)
        print(keywords)

    def get_top_themes(self, theme_parser:ThemeParser, app_id, reviews):
        themes = theme_parser.parse_themes(reviews)
        print(themes)


if __name__ == '__main__':
    sp = SentimentParser()
    kp = KeywordParser()
    tp = ThemeParser()

    app_id = 'com.spotify.music'
    reviews = sp.fetch_reviews(app_id)
    #sp.process_reviews(app_id, reviews)
    #sp.get_top_keywords(kp, app_id, reviews)
    sp.get_top_themes(tp, app_id, reviews)




