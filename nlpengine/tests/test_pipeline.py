import pytest
from unittest.mock import MagicMock, patch
from main import run_pipeline, SentimentParser, JobManager
from models import Job


@patch("main.JobManager")
def test_run_pipeline_no_jobs(mock_job_mgr):
    mock_job_mgr_instance = mock_job_mgr.return_value
    mock_job_mgr_instance.fetch_last_queued_job.return_value = None
    run_pipeline()