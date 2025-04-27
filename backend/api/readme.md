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
      "text": "yay you guys fixed it",
      "rating": 5,
      "sentiment": "Positive",
      "date": "2025-04-18T02:37:04",
      "review_id": "79db0bec-18b7-4283-9e40-20b724779414",
      "version": "9.0.34.593",
      "sentiment_score": 0.676
    },
    .
    .
    .
    {
      "text": "it's good 👍🏻 but some options like 1 hours 5 skips and add are 😞",
      "rating": 3,
      "sentiment": "Positive",
      "date": "2025-04-15T15:13:16",
      "review_id": "639ba858-4c26-41f3-8f02-e78a410cd799",
      "version": "",
      "sentiment_score": 0.639
    }
  ],
  "total": 100000,
  "next_offset": 10
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

### App validation
`GET /apps/validate-google-app-id?app_id=<app_id>`

If found
```
{
  "valid": true
}
```
If not found / error
```
{
  "valid": false,
  "error": "Unknown_App_ID"
}
OR
{
  "valid": false,
  "error": "Missing app_id"
}
```


### Post APIs
#### To request a new Job
`POST /queue`

{
"app_id": "com.spotify.music"
}

`status: queued | exists`
queued = added to queue now; exists = already in some stage in queue

`current_status / stage ` tells where it is now

If Job completed:
```
{
    "current_status": "completed",
    "job_id": "39669650-c926-4f0c-b84c-75be90cdb3fa",
    "stage": "done",
    "status": "exists"
}
```


If Job is New:
```
{
    "job_id": "382ecb10-cdfd-4287-bedf-55eb96a1764f",
    "stage": "scraper",
    "status": "queued"
}
```

If Job is already in Queue:
```
{
    "current_status": "queued",
    "job_id": "09e780bc-5edb-47c1-ad0b-fed7a4e5bb7c",
    "stage": "nlp",
    "status": "exists"
}
```
