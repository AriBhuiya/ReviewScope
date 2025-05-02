import pytest
from unittest.mock import MagicMock, patch
from main import run_pipeline, SentimentParser, JobManager
from models import Job


@patch("main.JobManager")
def test_run_pipeline_no_jobs(mock_job_mgr):
    mock_job_mgr_instance = mock_job_mgr.return_value
    mock_job_mgr_instance.fetch_last_queued_job.return_value = None
    run_pipeline()


@patch("main.MongoDAL")
@patch("main.JobManager")
@patch("main.HuggingfaceSentimentParser")
def test_pipeline_stages_and_updates(mock_parser, mock_job_mgr, mock_dal):
    # Set up fake job
    fake_job = Job(
        job_id="abc123",
        app_id="com.test.app",
        status="queued",
        stage="nlp",
        requested_at="2025-01-01T00:00:00",
        updated_at=None,
        retries=0,
        error_message=None,
        _id=None
    )

    # Mocks
    mock_job_mgr_instance = mock_job_mgr.return_value
    mock_job_mgr_instance.fetch_last_queued_job.return_value = fake_job

    mock_dal_instance = mock_dal.return_value
    mock_dal_instance.get_reviews_by_app_id.return_value = [{"text": "App is good"}]
    mock_dal_instance.insert_sentiments.return_value = None
    mock_dal_instance.insert_sentiment_metadata.return_value = None
    mock_dal_instance.insert_appname_cache.return_value = None

    mock_parser_instance = mock_parser.return_value
    mock_parser_instance.predict.return_value = [{"text": "App is good", "sentiment_score": 0.99}]

    from keyword_parsers.KeywordParser import KeywordParser
    from theme_parser.ThemeParser import ThemeParser

    with patch.object(KeywordParser, 'parse_and_get_top_keywords', return_value=[("good", 0.9)]), \
            patch.object(ThemeParser, 'parse_themes', return_value={"Performance": 42}):
        run_pipeline()

        # 🔍 Inspect update_job calls
        calls = mock_job_mgr_instance.update_job.call_args_list

        assert len(calls) == 2, "Expected two job updates (start, end)"

        start_call = calls[0].args[0]
        end_call = calls[1].args[0]

        assert start_call.status == "processing"
        assert end_call.status == "completed"
        assert end_call.stage == "done"


@patch("main.JobManager")
@patch("main.SentimentParser")
def test_pipeline_flow(mock_sp_class, mock_job_mgr_class):
    # Prepare fake job
    job = Job(
        job_id="abc",
        app_id="com.test.app",
        status="queued",
        stage="nlp",
        requested_at="2025-01-01T00:00:00",
        updated_at=None,
        retries=0,
        error_message=None,
        _id=None
    )

    # Mock JobManager
    mock_job_mgr = mock_job_mgr_class.return_value
    mock_job_mgr.fetch_last_queued_job.return_value = job
    mock_job_mgr.update_job.return_value = None

    # Mock SentimentParser
    mock_sp = mock_sp_class.return_value
    mock_sp.fetch_reviews.return_value = [{"text": "Great app!"}]
    mock_sp.get_top_keywords.return_value = [("great", 0.95)]
    mock_sp.get_top_themes.return_value = {"UX": 3, "Performance": 4}
    mock_sp.process_reviews.return_value = [{"text": "Great app!", "sentiment_score": 0.9}]
    mock_sp.dal.insert_sentiments.return_value = None
    mock_sp.dal.insert_sentiment_metadata.return_value = None
    mock_sp.dal.insert_appname_cache.return_value = None

    run_pipeline()

    mock_job_mgr.update_job.assert_called()
    assert job.status == "completed"
    assert job.stage == "done"
