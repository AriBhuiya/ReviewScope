import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock
from app.main import app
from app.deps import get_queue
from datetime import datetime
from app.models import Job

client = TestClient(app)


@pytest.fixture
def mock_queue():
    mock = MagicMock()
    app.dependency_overrides[get_queue] = lambda: mock
    return mock


def test_add_job_new(mock_queue):
    mock_queue.add_job.return_value = {
        "status": "queued", "stage": "scraper", "job_id": "abc123"
    }

    response = client.post("/queue/add", json={"app_id": "com.spotify.music"})
    assert response.status_code == 200
    assert response.json()["status"] == "queued"
    assert response.json()["job_id"] == "abc123"


def test_poll_jobs(mock_queue):
    now = datetime.utcnow().isoformat()
    mock_queue.poll_jobs.return_value = [
        Job(
            job_id="abc123",
            app_id="com.spotify.music",
            stage="scraper",
            status="queued",
            requested_at=now,
            updated_at=now
        )
    ]

    response = client.get("/queue/poll?stage=scraper&status=queued&limit=1")
    assert response.status_code == 200
    assert response.json()[0]["app_id"] == "com.spotify.music"


def test_update_job(mock_queue):
    mock_queue.update_job.return_value = {
        "status": "updated", "job_id": "abc123"
    }

    response = client.post("/queue/abc123/update", json={
        "status": "processing",
        "stage": "nlp"
    })
    assert response.status_code == 200
    assert response.json()["status"] == "updated"


def test_status_check(mock_queue):
    now = datetime.utcnow().isoformat()
    mock_queue.get_status.return_value = {
        "status": "processing",
        "stage": "nlp",
        "requested_at": now,
        "updated_at": now
    }

    response = client.get("/queue/status/com.spotify.music")
    assert response.status_code == 200
    assert response.json()["stage"] == "nlp"


def test_overview(mock_queue):
    now = datetime.utcnow().isoformat()
    mock_queue.get_overview.return_value = {
        "timestamp": now,
        "active_jobs": [
            {
                "app_id": "com.spotify.music",
                "status": "queued",
                "stage": "scraper",
                "requested_at": now,
                "updated_at": now
            }
        ],
        "done_jobs_today": 3
    }

    response = client.get("/queue/overview")
    assert response.status_code == 200
    assert response.json()["done_jobs_today"] == 3