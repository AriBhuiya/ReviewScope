# 📬 Job Queue Service — ReviewScope

This service is the **central coordinator** for the ReviewScope pipeline.  
It tracks and manages the lifecycle of app review processing jobs — from scraping to NLP — using a lightweight API backed by MongoDB.

Built with **FastAPI**, it enables asynchronous, resilient processing between distributed services (scraper, NLP engine, etc.).

---

## 🚀 Features

- REST API for queueing, polling, and tracking jobs
- MongoDB-backed persistence with retry and failure support
- Designed for use with independent workers (scraper/NLP)
- FastAPI auto-docs available at `/docs`
- Works standalone or within Docker Compose

---

## 🔧 Running the Job Queue Individually

You can run this microservice on its own for testing or integration with workers.

### Prerequisites

- Python 3.10+
- MongoDB (local or remote)
- `uvicorn` + `fastapi` + `pymongo` (see `requirements.txt`)

### Steps

```
cd jobqueue
pip install -r requirements.txt
uvicorn app.main:app --reload --port 9000
```

Then access it at:  
`http://localhost:9000`

---

## 📄 Environment Variables (`.env`)

Create a `.env` file in the `jobqueue/` directory with the following keys:

```
MONGO_URI=mongodb://devuser:devpass@mongo:27017/?authSource=admin
MONGO_DB_NAME=reviewscope
```

> These values are used at startup via `python-dotenv`.

---

## 🧪 Development Notes

- The DAL abstracts away Mongo logic to make switching easier
- Job states follow a defined lifecycle (scraper → nlp → done)
- Errors and retries are tracked, with potential for history logging
- FastAPI provides live interactive docs at `/docs`

---

## 🐳 Docker

To run the queue service in Docker:

```
docker build -t reviewscope-jobqueue .
docker run --rm -p 9000:9000 --env-file .env reviewscope-jobqueue
```

Or as part of the full stack:

```
docker compose up jobqueue
```

---

## 📚 API Documentation

The full API spec — including endpoints, request bodies, and sample responses — is available at:

👉 [API.md](./API.md)

👉 Or use the Swagger Docs at `localhost:9000/docs`

---

