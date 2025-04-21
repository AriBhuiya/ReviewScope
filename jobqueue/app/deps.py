from fastapi import Request
from app.queue_interface import JobQueue

def get_queue(request: Request) -> JobQueue:
    return request.app.state.queue