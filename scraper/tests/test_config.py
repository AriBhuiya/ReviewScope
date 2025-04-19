from scraper.config import load_config

def test_config_loads():
    cfg = load_config("../config.yaml")
    assert "scraper" in cfg
    assert "source" in cfg["scraper"]
    assert "country" in cfg["scraper"]
    assert "review_count" in cfg["scraper"]