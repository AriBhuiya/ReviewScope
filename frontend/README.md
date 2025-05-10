# 🖥️ Frontend Dashboard — ReviewScope

This is the **frontend UI** of ReviewScope — a minimal, responsive dashboard built using `Vite + React`.  
It visualizes insights such as:

- Sentiment trends over time
- Rating distributions
- Top themes and keywords
- Real-time review sampling

The dashboard is designed to consume data via the `backend` API and display it in a simple, clean interface.

---

## 🚀 Features

- Built with `Vite` for fast dev feedback
- Minimal React component structure
- Word cloud and chart visualizations (via `chart.js`, `d3`, etc.)
- Configurable backend API URL (via `.env`)
- Dockerized for easy deployment

---

## 🧠 Why a Job Queue? (Distributed by Design)
The Job Queue decouples the scraping and NLP services, turning the pipeline into a distributed, fault-tolerant system.

**🔗 Without tight coupling:**
The scraper and NLP engine don't need to run together or even know about each other.

Each service pulls jobs when it's ready (poll API), allowing independent scheduling and parallel execution.

### 🧩 Benefits of this design:
✅ Resilience: If one worker crashes, others can continue processing.

✅ Scalability: Run multiple scrapers or NLP engines across machines.

✅ Asynchronous: Different parts of the pipeline can run on different time schedules.

✅ Flexibility: You can swap or upgrade one part of the system without breaking the others.

## 𖭦 Stages and Status
| Stage   | Status     | Owner<br/>(Not Stored) | Meaning                                     |
| ------- | ---------- |------------------------| ------------------------------------------- |
| scraper | queued     | Scraper                | Job is waiting to be picked up for scraping |
| scraper | processing | Scraper                | Scraper is currently processing the job     |
| scraper | error      | Scraper                | Scraper failed to process the job           |
| nlp     | queued     | NLP                    | Ready for NLP processing                    |
| nlp     | processing | NLP                    | NLP is currently working on it              |
| nlp     | error      | NLP                    | NLP pipeline failed                         |
| done    | completed  | System                 | Job is fully processed and data is ready    |


## 🔧 Running the Frontend Individually

You can run the frontend separately for local development.

### Prerequisites
- Node.js 18+
- `.env` file in the frontend root

### Steps

```
cd frontend
npm install
npm run dev
```

The dashboard will be available at:  
`http://localhost:3000`

---

## 📄 Environment Variables (`.env`)

Create a `.env` file in the `frontend/` directory.

Example:

```
# [For native depl] The following is overridden in docker compose file.
# VITE_API_URL=http://localhost:5173

```

---

## 🐳 Docker

To run this frontend in Docker (development or production):

```
docker build -t reviewscope-frontend .
docker run --rm -p 3000:3000 --env-file .env reviewscope-frontend
```

Or with Compose:

```
docker compose up frontend
```

---

## 📁 Structure

```
frontend/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Page-level views
│   ├── services/         # API calls and fetchers
│   └── App.jsx           # Root component
├── .env
├── Dockerfile
├── index.html
└── README.md             # You're here
```

---

## 🧪 Dev Notes

- Uses `Vite` — fast build and HMR
- Code is linted using ESLint
- API calls are made via `fetch()` and isolated in a service layer
- Environment-based config makes switching between local/Docker easy

---
