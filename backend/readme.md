# 🛠 Backend Service — ReviewScope

This is the **API layer** of the ReviewScope platform.  
It provides RESTful endpoints for:
- App metadata
- Sentiment results
- Keyword and theme insights
- Job queue coordination

Built with **Go** using the `gin-gonic` framework.  
This is the only public-facing service in the system.

---

## 🚀 Features

- Fast, stateless API with clean route structure
- DAL-based design for swapping databases
- MongoDB-backed, but extensible to other stores
- Integrated Swagger (`/swagger/index.html`) via swaggo
- Works standalone or within the full `docker-compose` setup

---

## 🔧 Running the Backend Individually

You can run this backend as a standalone API service.

### Prerequisites
- Go 1.21+
- MongoDB (local or remote instance)
- `.env` file in `backend/` directory

### Steps

```
cd backend
go run main.go
```

The server starts at:  
`http://localhost:8080`

> If you're running this outside Docker, ensure your `.env` file is correctly configured.

---

## 📄 Environment Variables (`.env`)

This service uses environment variables for configuration.  
Create a `.env` file in the same directory as `main.go`.

### Required keys:

```
MONGO_URI=mongodb://devuser:devpass@mongo:27017/?authSource=admin
MONGO_DB_NAME=reviewscope
# [For native depl] The following are overridden in the dockercompose file
# QUEUE_URI=http://localhost:8000/
# FRONTEND_ORIGIN=http://localhost:5173

```

> These values are injected at runtime. `godotenv` picks them up from this file, and Docker Compose in production/dev.

---

## 📚 API Documentation

API details (routes, responses, examples) are documented separately.

👉 See [API documentation](api/api.md)


## 🐳 Docker

This service is fully containerized and used in the full-stack Docker Compose setup.

You can build and run it independently:

```
docker build -t reviewscope-backend .
docker run --rm -p 8080:8080 --env-file .env reviewscope-backend
```

Or run as part of the full stack with:

```
docker compose up backend
```

---

## 🤝 Contributing

- Follow Go naming conventions
- Keep handlers and DAL methods small and testable
- All API changes should be reflected in `API.md`

---

