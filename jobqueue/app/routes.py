from typing import List

from fastapi import APIRouter, Request, Depends, Query
from fastapi.responses import JSONResponse
from app.models import JobUpdateRequest
from fastapi import Path
from app import JobQueue
from app.deps import get_queue
from app.models import Job

router = APIRouter()
@router.get("/")
def root():
    return {"status": "job queue up and running"}

@router.post("/queue/add")
async def add_job(data: dict, queue: JobQueue = Depends(get_queue)):
    app_id = data.get("app_id")
    if not app_id:
        return {"error": "Missing app_id"}
    return queue.add_job(app_id)

@router.get("/queue/poll", response_model=List[Job])
def poll_jobs(
    stage: str = Query(..., description="scraper or nlp"),
    status: str = Query(..., description="queued, processing, etc"),
    limit: int = Query(1, ge=1),
    queue: JobQueue = Depends(get_queue)
):
    try:
        jobs = queue.poll_jobs(stage, status, limit)
        return jobs
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/queue/{job_id}/update")
def update_job(
    job_id: str = Path(...),
    update: JobUpdateRequest = ...,
    queue: JobQueue = Depends(get_queue)
):
    return queue.update_job(
        job_id=job_id,
        status=update.status,
        stage=update.stage,
        error_message=update.error_message
    )

@router.get("/queue/status/{app_id}")
def get_status(app_id: str, queue: JobQueue = Depends(get_queue)):
    return queue.get_status(app_id)

@router.get("/queue/overview")
def queue_overview(queue: JobQueue = Depends(get_queue)):
    return queue.get_overview()