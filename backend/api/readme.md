# Documentation for API
## GET APIs
#### Data for Sentiments over Time chart
`GET GET /results/<app_id>/sentiment-over-time`
Example: ✅
```
{
  "app_id": "com.spotify.music",
  "granularity": "month",
  "time_series": [
      "month": "2025-01",
      "avg_sentiment": 0.54,
      "review_count": 150
    },
    {
      "month": "2025-02",
      "avg_sentiment": 0.62,
      "review_count": 185
    },
    {
      "month": "2025-03",
      "avg_sentiment": 0.68,
      "review_count": 202
    },
    {
      "month": "2025-04",
      "avg_sentiment": 0.71,
      "review_count": 177
    }
  ]
}
```

#### Api for get Apps 
`GET /apps`
Example ✅
```
[
  {
    "app_id": "com.spotify.music",
    "name": "Spotify",
    "last_updated": "2025-04-15"
  },
  {
    "app_id": "com.duolingo",
    "name": "Duolingo",
    "last_updated": "2025-04-10"
  }
]
```

#### Api for Top Themes 
`GET /results/<app_id>/themes`
✅
```
{
  "app_id": "com.spotify.music",
  "themes": [
    {
      "label": "Performance",
      "keywords": ["slow", "lag", "buffering", "freeze"],
      "review_count": 48,
      "example_reviews": [
        "App frequently freezes and is very slow to respond.",
        "The performance has degraded since the last update."
      ]
    },
    {
      "label": "Feature Requests",
      "keywords": ["offline", "add", "request", "missing"],
      "review_count": 30,
      "example_reviews": [
        "Please add an offline mode.",
        "Would be great if I could play music without internet."
      ]
    }
  ]
}
```

#### Api for Top Keywords ✅
`GET /results/<app_id>/keywords?limit=5`
```
{
  "app_id": "com.spotify.music",
  "top_keywords": [
    { "keyword": "crash", "count": 87 },
    { "keyword": "playback", "count": 53 },
    { "keyword": "ads", "count": 44 }
  ]
}
```

#### Get Reviews
`GET /results/com.spotify.music/reviews?limit=3&sentiment=negative`
[all | positive | negative | neutral] ✅

```
{
  "app_id": "com.spotify.music",
  "reviews": [
    {
      "rating": 2,
      "sentiment": "Negative",
      "theme": "Performance",
      "text": "App frequently freezes and is very slow to respond.",
      "date": "2024-04-15"
    },
    {
      "rating": 2,
      "sentiment": "Negative",
      "theme": "Bugs",
      "text": "The app crashes every time I try to open a playlist.",
      "date": "2024-04-05"
    }
  ],
  "total": 2
}
```

#### Get Ratings Distributions 
GET /results/<app_id>/ratings-distribution ✅
```
{
  "app_id": "com.spotify.music",
  "ratings_distribution": {
    "1": 12,
    "2": 35,
    "3": 57,
    "4": 102,
    "5": 380
  },
  "total_reviews": 586
}
```

```
{
  "timestamp": "2025-04-18T17:10:00Z",
  "active_jobs": [
    {
      "app_id": "com.spotify.music",
      "status": "queued",
      "stage": "waiting_to_scrape",
      "requested_at": "2025-04-18T14:42:00Z"
    },
    {
      "app_id": "com.twitter.android",
      "status": "processing",
      "stage": "nlp_analysis",
      "requested_at": "2025-04-18T13:17:00Z"
    },
    {
      "app_id": "com.whatsapp",
      "status": "error",
      "stage": "scraping_failed",
      "requested_at": "2025-04-17T18:59:00Z"
    }
  ],
  "done_jobs_today": 1
}
```

### Post APIs
#### To request a new Job
`POST /queue`

{
"app_id": "com.spotify.music"
}

If Job exists:
```
{
  "status": "exists",
  "message": "App already processed. Load from cache.",
  "app_id": "com.spotify.music"
}
```


If Job is New:
```
{
  "status": "queued",
  "job_id": "661f4b2c4afcdc001245fc87",
  "app_id": "com.spotify.music"
}
```

If Job is already in Queue:
```
{
  "status": "queued_already",
  "message": "App already in processing queue.",
  "stage": "2",
  "job_id": "661f4b2c4afcdc001245fc87"
}
```
