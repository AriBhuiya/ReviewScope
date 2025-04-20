package db

import "context"
import "github.com/aribhuiya/backend/models"

type DAL interface {
	GetApps(ctx context.Context) ([]models.App, error)
	GetTopKeywords(ctx context.Context, appID string, limit int) ([]models.KeywordEntry, error)
	GetTopThemes(ctx context.Context, appID string, limit int) ([]models.ThemeEntry, error)
	GetRatingsDistribution(ctx context.Context, appID string) (map[string]int, int, error)
	GetSentimentOverTime(ctx context.Context, appID string) ([]models.SentimentTimePoint, error)
	GetReviews(ctx context.Context, appID, sentiment string, limit, offset int) ([]models.ReviewEntry, int, error)
}
