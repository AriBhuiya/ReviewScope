import os
import random
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

client = MongoClient("mongodb://devuser:mRg22hb7sVet@143.198.161.203:27017/develop")
db = client.get_default_database()

reviews_collection = db["reviews"]
sentiment_collection = db["sentiments"]

def assign_fake_sentiment(text):
    sentiment_code = random.choices([0, 1, 2], weights=[0.2, 0.3, 0.5])[0]

    if sentiment_code == 0:
        score = round(random.uniform(0.0, 0.4), 3)
        label = "NEGATIVE"
    elif sentiment_code == 1:
        score = round(random.uniform(0.4, 0.6), 3)
        label = "NEUTRAL"
    else:
        score = round(random.uniform(0.6, 1.0), 3)
        label = "POSITIVE"

    return {
        "sentiment_label": label,
        "sentiment_code": sentiment_code,
        "sentiment_score": score
    }

def run_nlp_fake_engine():
    reviews = list(reviews_collection.find({}))
    print(f"🔍 Found {len(reviews)} reviews.")

    annotated = []
    for review in reviews:
        sentiment = assign_fake_sentiment(review["text"])
        output = {
            "review_id": review["review_id"],
            "app_id": review["app_id"],
            "text": review["text"],
            "rating": review["rating"],
            "timestamp": review["timestamp"],
            "version": review.get("version"),
            **sentiment
        }
        annotated.append(output)

    if annotated:
        sentiment_collection.insert_many(annotated)
        print(f"✅ Inserted {len(annotated)} annotated reviews into `sentiments` collection.")


def get_top_themes_and_keywords():
    fake_themes = [
        "Bugs", "Performance", "Feature requests", "User interface", "Audio", "Ads",
        "Login issues", "Crashes", "Offline mode", "Battery drain", "Design", "Sync issues"
    ]

    fake_keywords = [
        "crash", "ads", "offline", "playlist", "skip", "pause", "login", "error",
        "download", "update", "buffer", "stream", "design", "UI", "lag"
    ]

    themes = [{"theme": theme, "count": random.randint(10, 300)} for theme in random.sample(fake_themes * 5, 50)]
    keywords = [{"keyword": kw, "count": random.randint(5, 200)} for kw in random.sample(fake_keywords * 5, 50)]

    return {
        "top_themes": sorted(themes, key=lambda x: -x["count"])[:50],
        "top_keywords": sorted(keywords, key=lambda x: -x["count"])[:50]
    }

def store_themes_and_keywords(app_id, data):
    payload = {
        "app_id": app_id,
        "top_themes": data["top_themes"],
        "top_keywords": data["top_keywords"]
    }
    meta_collection = db["sentiments_metadata"]
    # upsert in case you re-run this
    meta_collection.update_one(
        {"app_id": app_id},
        {"$set": payload},
        upsert=True
    )


if __name__ == "__main__":
    #run_nlp_fake_engine()
    data = get_top_themes_and_keywords()
    store_themes_and_keywords("com.spotify.music", data)