def run_scraper(scraper, app_id, count=100):
    reviews = scraper.scrape(app_id, count)
    return reviews