package models

import "time"

type App struct {
	AppID       string    `bson:"app_id" json:"app_id"`
	Store       string    `bson:"store" json:"store"`
	LastUpdated time.Time `bson:"last_updated" json:"last_updated"`
}
type KeywordEntry struct {
	Keyword string `bson:"keyword" json:"keyword"`
	Count   int    `bson:"count" json:"count"`
}

type ThemeEntry struct {
	Label string `bson:"theme" json:"label"`
	Count int    `bson:"count" json:"count"`
}

type RatingsDistributionResponse struct {
	AppID               string         `json:"app_id"`
	RatingsDistribution map[string]int `json:"ratings_distribution"`
	TotalReviews        int            `json:"total_reviews"`
}

type SentimentTimePoint struct {
	Month        string  `json:"month"`         // "2025-04"
	AvgSentiment float64 `json:"avg_sentiment"` // e.g., 0.71
	ReviewCount  int     `json:"review_count"`  // how many reviews in this month
}

type ReviewEntry struct {
	Text      string `json:"text" bson:"text"`
	Rating    int    `json:"rating" bson:"rating"`
	Sentiment string `json:"sentiment" bson:"sentiment_label"`
	Date      string `json:"date"` // formatted YYYY-MM-DD
	//Theme          string  `json:"theme" bson:"theme"` // optional
	ReviewId       string  `json:"review_id,omitempty"`
	Version        string  `json:"version" bson:"version"`
	SentimentScore float64 `json:"sentiment_score" bson:"sentiment_score"`
}

type ReviewResponse struct {
	AppID      string        `json:"app_id"`
	Reviews    []ReviewEntry `json:"reviews"`
	Total      int           `json:"total"`
	NextOffset int           `json:"next_offset"`
}

type ValidateResponse struct {
	Valid bool   `json:"valid"`
	Name  string `json:"name,omitempty"`
	Error string `json:"error,omitempty"`
}
type QueueRequest struct {
	AppID string `json:"app_id"`
}
