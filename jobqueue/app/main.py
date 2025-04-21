from fastapi import FastAPI
from app.routes import router
from app.mongo_job_queue import mongo
from app.mongo_job_queue.mongo_job_queue import MongoJobQueue
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
app.include_router(router)

@app.on_event("startup")
def startup():
    mongo.connect()
    app.state.queue = MongoJobQueue()  # attach DAL via dependency injectiond

@app.on_event("shutdown")
def shutdown():
    mongo.disconnect()