from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Job(BaseModel):
    job_id: str
    app_id: str
    status: str
    stage: str
    requested_at: datetime
    updated_at: datetime
    retries: int = 0
    error_message: Optional[str] = None


class JobResponse(BaseModel):
    status: str
    stage: str
    job_id: Optional[str] = None

class JobUpdateRequest(BaseModel):
    status: str  # queued | processing | completed | error
    stage: str   # scraper | nlp | done
    error_message: Optional[str] = None  # optional field for errors