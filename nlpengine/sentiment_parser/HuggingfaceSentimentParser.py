# huggingface_parser.py
from tqdm import tqdm
from transformers import pipeline
import torch
from sentiment_parser.BaseSentimentParser import BaseSentimentParser


class HuggingfaceSentimentParser(BaseSentimentParser):
    def __init__(self):
        torch.set_num_threads(1)  # Important for small CPUs like Raspberry Pi
        self.sentiment_pipeline = pipeline(
            "sentiment-analysis",
            model="nlptown/bert-base-multilingual-uncased-sentiment",
            device=-1  # Force CPU
        )

    def predict(self, reviews: list) -> list:
        results = []
        texts = [r.get('text', '') for r in reviews]

        # Instead of passing huge list, we batch manually
        batch_size = 10  # Adjust batch size if needed
        for i in tqdm(range(0, len(texts), batch_size)):
            batch_texts = texts[i:i + batch_size]
            predictions = self.sentiment_pipeline(batch_texts)

            for review, prediction in zip(reviews[i:i + batch_size], predictions):
                label = prediction['label']  # Example: '5 stars'
                score = prediction['score']

                if "4" in label or "5" in label:
                    sentiment_label = "POSITIVE"
                    sentiment_code = 2
                elif "1" in label or "2" in label:
                    sentiment_label = "NEGATIVE"
                    sentiment_code = 0
                else:
                    sentiment_label = "NEUTRAL"
                    sentiment_code = 1

                enriched_review = {
                    **review,
                    "sentiment_score": score,
                    "sentiment_label": sentiment_label,
                    "sentiment_code": sentiment_code,
                }
                results.append(enriched_review)

        return results
