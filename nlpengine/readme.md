# 🧠 NLP Engine — ReviewScope

This service processes app reviews using **sentiment analysis models** and stores enriched metadata like sentiment scores, labels, keywords, and themes.

Built with `Python 3.11`, it supports:
- `VADER` (lightweight rule-based)
- `HuggingFace Transformers` (deep learning models)

The NLP engine is intended to run **periodically**, either manually or via cron/scheduler, to pick up jobs from the Job Queue and write back results to MongoDB.

---

## 🚀 Features

- Supports pluggable sentiment models (`VADER`, `HuggingFace`)
- Extracts top keywords using TF-IDF
- Maps reviews to predefined themes
- Can be extended with custom models or topic extraction
- Decoupled DAL allows MongoDB switching

---

## 🔧 Running Locally

You can run this module directly for testing or development.

### Prerequisites
- Python 3.11+
- `nltk`, `transformers`, `sklearn`, etc. (see `requirements.txt`)
- `.env` file with DB and queue config

### Steps

```
cd nlpengine
pip install -r requirements.txt
python -m nltk.downloader vader_lexicon
python main.py
```

> The `cron.py` script pulls jobs from the queue and processes them on a loop.

---

## 📄 Environment Variables (`.env`)

Set up your `.env` file in the root of `nlpengine/`.

Example:

```
MONGO_URI=mongodb://devuser:devpass@mongo:27017/?authSource=admin
MONGO_DB_NAME=reviewscope
# [For native depl] Overridden in docker-compose
# QUEUE_URI=http://localhost:8000
# CRON=10
# MODEL=VADER

```

- `MODEL`: Choose between `VADER` or `HUGGINGFACE`

---

## 🐳 Docker

This service is containerized and ready for scheduled or looped execution.

### Build and Run

```
docker build -t reviewscope-nlpengine .
docker run --rm --env-file .env reviewscope-nlpengine
```

Or as part of the full system:

```
docker compose up nlpengine
```

---


## 🧠 Architecture Note

This service is **decoupled and stateless** — it picks up work from the queue when available.  
This makes it easy to scale horizontally, run on a schedule, or containerize without tight dependencies.

---
