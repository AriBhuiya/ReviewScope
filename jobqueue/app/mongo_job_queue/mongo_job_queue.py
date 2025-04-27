from typing import List, Optional
from uuid import uuid4

from pymongo import ASCENDING

from .. import get_collection, JobQueue
from datetime import datetime
from ..models import JobResponse, Job


class MongoJobQueue(JobQueue):
    def __init__(self):
        self.jobs = get_collection("jobs")
        self.history = get_collection("job_history")

    def add_job(self, app_id: str) -> dict:
        existing = self.jobs.find_one({"app_id": app_id})
        if existing:
            return {
                "status": "exists",
                "stage": existing["stage"],
                "current_status": existing["status"],
                "job_id": existing["job_id"]
            }

        now = datetime.utcnow()
        new_id = str(uuid4())
        job = Job(
            job_id=new_id,
            app_id=app_id,
            status="queued",
            stage="scraper",
            requested_at=now,
            updated_at=now,
        )

        self.jobs.insert_one(job.dict())
        return JobResponse(status="queued", stage="scraper", job_id=new_id).dict()

    def poll_jobs(self, stage: str, status: str, limit: int = 1) -> List[Job]:
        query = {}
        if stage.lower() != "any":
            query["stage"] = stage
        if status.lower() != "any":
            query["status"] = status

        cursor = self.jobs.find(query).sort("requested_at", ASCENDING).limit(limit)
        return [Job(**doc) for doc in cursor]

    def update_job(self, job_id: str, status: str, stage: str, error_message: Optional[str] = None) -> dict:
        now = datetime.utcnow()
        update_fields = {
            "status": status,
            "stage": stage,
            "updated_at": now
        }
        if error_message:
            update_fields["error_message"] = error_message
        else:
            update_fields["error_message"] = ""

        result = self.jobs.update_one(
            {"job_id": job_id},
            {"$set": update_fields}
        )

        if result.matched_count == 0:
            return {"error": "Job not found"}

        self.history.insert_one({
            "job_id": job_id,
            "app_id": self.jobs.find_one({"job_id": job_id})["app_id"],
            "timestamp": now,
            "stage": stage,
            "status": status
        })

        return {"status": "updated", "job_id": job_id}

    def get_status(self, app_id: str) -> dict:
        job = self.jobs.find_one({"app_id": app_id})
        if not job:
            return {"error": "Job not found"}

        return {
            "status": job["status"],
            "stage": job["stage"],
            "requested_at": job["requested_at"],
            "updated_at": job["updated_at"]
        }

    def get_overview(self) -> dict:
        from datetime import datetime

        now = datetime.utcnow()
        start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)

        active_filter = {"status": {"$in": ["queued", "processing"]}}
        completed_today_filter = {
            "status": "completed",
            "updated_at": {"$gte": start_of_day}
        }

        active_jobs_cursor = self.jobs.find(active_filter)
        active_jobs = []
        for job in active_jobs_cursor:
            active_jobs.append({
                "app_id": job["app_id"],
                "status": job["status"],
                "stage": job["stage"],
                "requested_at": job["requested_at"],
                "updated_at": job["updated_at"]
            })

        done_today_count = self.jobs.count_documents(completed_today_filter)

        return {
            "timestamp": now,
            "active_jobs": active_jobs,
            "done_jobs_today": done_today_count
        }