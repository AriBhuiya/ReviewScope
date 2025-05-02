# Use this to run continiously
import os

import main
import time
from dotenv import load_dotenv

load_dotenv()
cron = os.getenv("CRON")
while True:
    main.run_pipeline()
    time.sleep(int(cron))
