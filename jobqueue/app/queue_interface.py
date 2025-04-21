from abc import ABC, abstractmethod
from typing import List, Dict

class JobQueue(ABC):
    @abstractmethod
    def add_job(self, app_id: str) -> Dict: ...

    @abstractmethod
    def poll_jobs(self, stage: str, status: str, limit: int = 1) -> List[Dict]: ...

    @abstractmethod
    def update_job(self, job_id, status, stage, error_message): ...
    #
    @abstractmethod
    def get_status(self, app_id: str) -> Dict: ...

    @abstractmethod
    def get_overview(self) -> Dict: ...
