from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class Job:
    job_id: str
    app_id: str
    status: str
    stage: Optional[str]
    requested_at: datetime
    updated_at: Optional[datetime]
    retries: int
    error_message: Optional[str]
    _id: str
