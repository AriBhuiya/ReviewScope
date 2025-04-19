def run_scraper(scraper, storage, app_id, count=100):
    reviews = scraper.scrape(app_id, count)
    storage.save(reviews, app_id)