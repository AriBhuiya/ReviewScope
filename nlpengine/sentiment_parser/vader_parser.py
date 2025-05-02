# vader_parser.py
from sentiment_parser.BaseSentimentParser import BaseSentimentParser
from nltk.sentiment import SentimentIntensityAnalyzer


class VaderSentimentParser(BaseSentimentParser):
    def __init__(self):
        self.analyzer = SentimentIntensityAnalyzer()

    def predict(self, reviews: list) -> list:
        results = []
        for review in reviews:
            text = review.get('text', '')
            if text is None:
                text = ''
            scores = self.analyzer.polarity_scores(text)
            compound = scores['compound']  # -1 to 1

            normalized_score = (compound + 1) / 2

            if normalized_score >= 0.6:
                label = "POSITIVE"
                code = 2
            elif normalized_score <= 0.4:
                label = "NEGATIVE"
                code = 0
            else:
                label = "NEUTRAL"
                code = 1

            enriched_review = {
                **review,
                "sentiment_score": normalized_score,
                "sentiment_label": label,
                "sentiment_code": code,
            }
            results.append(enriched_review)
        return results
