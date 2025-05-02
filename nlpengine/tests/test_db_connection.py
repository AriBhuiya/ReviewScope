# test_db_connection.py
from nlpengine.db.mongo import db


# FOr checking DB connection - Not recommended to use in CI/CD because of external deps
# def test_mongo_connection():
#     collections = db.list_collection_names()
#     assert isinstance(collections, list)
#     assert "reviews" in collections, "Expected 'reviews' collection not found in database."
