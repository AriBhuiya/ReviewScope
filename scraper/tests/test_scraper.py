import pytest

from scraper.scrapers.google_scrapper import GoogleScraper


def test_scraper_returns_reviews():
    scraper = GoogleScraper()
    data = scraper.scrape("com.spotify.music", count=5)

    assert isinstance(data, list)
    assert len(data) > 0

    for review in data:
        assert "review_id" in review
        assert "app_id" in review
        assert "text" in review
        assert "rating" in review
        assert "timestamp" in review