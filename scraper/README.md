# 🔍 Scraper Service — ReviewScope

This is the **review scraping microservice** in the ReviewScope pipeline.  
It fetches real reviews from the **Google Play Store** (via `google-play-scraper`) and enqueues jobs for downstream sentiment analysis.

Designed to be **configurable**, **batch-driven**, and run as a background job or cron task.

---

## 🚀 Features

- Scrapes reviews using `google-play-scraper`
- Configurable by language, country, sort order, and review count
- Can run independently or be scheduled via cron
- Automatically pushes scraped reviews into MongoDB
- Sends app_id into the job queue for further processing

---

## ⚙️ Configuration

All scraper behavior is controlled via `config.yaml`.

```yaml
scraper:
  source: "google"         # or "ios" (future)
  lang: "en"
  country: "gb"            # e.g., gb, us, in
  review_count: 100000     # Total reviews to pull
  sort_by: "newest"        # newest or most_relevant
```

> This file controls the params of the scraper

---

## 🔧 Running Locally

### Prerequisites
- Python 3.10+
- `google-play-scraper`
- MongoDB
- `jobqueue` service should be reachable

### Steps

```
cd scraper
pip install -r requirements.txt
python main.py
```

This will read the config and begin scraping the configured app(s).

---

## 📄 Environment Variables (`.env`)

```env
MONGO_URI=mongodb://devuser:devpass@mongo:27017/?authSource=admin
MONGO_DB_NAME=reviewscope
# [For native depl] Overridden in docker-compose
# QUEUE_URI=http://localhost:8000
# CRON=10

```

Make sure this file is present and correctly configured before running the scraper.

---

## 🐳 Docker Usage

### Build the image

```
docker build -t reviewscope-scraper .
```

### Run with env file

```
docker run --rm --env-file .env reviewscope-scraper
```

> By default, `cron.py` will run in an infinite loop and poll the job queue periodically.

---

## 🧪 Development Notes

- The module is designed to run as a cron-like job, calling `run_pipeline()` repeatedly.
- It can be scheduled externally via cron, Kubernetes `CronJob`, or a Docker loop.
- The actual review scraping logic is isolated and can be extended per store (Google, iOS, etc.)

---