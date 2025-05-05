from typing import Optional

import requests
from requests import RequestException

from models import Job


class JobManager:
    def __init__(self, base_url):
        self.base_url = base_url

    def fetch_last_queued_job(self):
        try:
            response = requests.get(
                f"{self.base_url}/queue/poll",
                params={"stage": "scraper", "status": "queued", "limit": 1},
                timeout=5
            )
            response.raise_for_status()
            data = response.json()

            if not data:
                return None

            job_data = data[0] if isinstance(data, list) else data  # in case it's wrapped
            return Job(
                job_id=job_data["job_id"],
                app_id=job_data["app_id"],
                status=job_data["status"],
                stage=job_data.get("stage"),
                requested_at=job_data["requested_at"],
                updated_at=job_data.get("updated_at"),
                retries=job_data["retries"],
                error_message=job_data.get("error_message"),
                _id=''
            )

        except RequestException as e:
            raise Exception(f"Network error: {str(e)}") from e
        except Exception as e:
            raise Exception(f"Failed to fetch job: {str(e)}") from e

    def update_job(self, job: Job):
        try:
            payload = {
                "status": job.status,
                "stage": job.stage,
                "error_message": job.error_message
            }

            response = requests.post(
                f"{self.base_url}/queue/{job.job_id}/update",
                json=payload,
                timeout=5
            )
            response.raise_for_status()
            return response.json()

        except requests.RequestException as e:
            raise Exception(f"Failed to update job {job.job_id}: {str(e)}") from e