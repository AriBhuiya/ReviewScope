package handlers

import (
	"math"
	"net/http"
	"strconv"

	"github.com/aribhuiya/backend/models"
	"github.com/gin-gonic/gin"
)

// GetKeywords /results/:app_id/keywords
func GetKeywords(c *gin.Context) {
	appID := c.Param("app_id")
	limitStr := c.DefaultQuery("limit", "5")
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 {
		limit = 5
	}

	ctx := c.Request.Context()
	keywords, err := dal.GetTopKeywords(ctx, appID, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch keywords"})
		return
	}
	// round keywords count to 2 dec
	for i := range keywords {
		keywords[i].Count = math.Round(keywords[i].Count*100) / 100
	}

	c.JSON(http.StatusOK, gin.H{
		"app_id":       appID,
		"top_keywords": keywords,
	})
}

// GetThemes /results/:app_id/themes
func GetThemes(c *gin.Context) {
	appID := c.Param("app_id")
	limitStr := c.DefaultQuery("limit", "5")

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 {
		limit = 5
	}

	ctx := c.Request.Context()
	themes, err := dal.GetTopThemes(ctx, appID, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch themes"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"app_id": appID,
		"themes": themes,
	})
}

// GetRatingsDistribution /results/:app_id/ratings-distribution
func GetRatingsDistribution(c *gin.Context) {
	appID := c.Param("app_id")
	ctx := c.Request.Context()

	dist, total, err := dal.GetRatingsDistribution(ctx, appID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch rating distribution"})
		return
	}

	response := models.RatingsDistributionResponse{
		AppID:               appID,
		RatingsDistribution: dist,
		TotalReviews:        total,
	}

	c.JSON(http.StatusOK, response)
}

// GetSentimentOverTime /results/:app_id/sentiment-over-time
func GetSentimentOverTime(c *gin.Context) {
	appID := c.Param("app_id")
	ctx := c.Request.Context()

	data, err := dal.GetSentimentOverTime(ctx, appID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch sentiment data"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"app_id":      appID,
		"granularity": "month",
		"time_series": data,
	})
}

// GetReviews /results/:app_id/reviews
func GetReviews(c *gin.Context) {
	appID := c.Param("app_id")
	limitStr := c.DefaultQuery("limit", "10")
	offsetStr := c.DefaultQuery("offset", "0")
	sentiment := c.DefaultQuery("sentiment", "all")

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 {
		limit = 10
	}
	offset, err := strconv.Atoi(offsetStr)
	if err != nil || offset < 0 {
		offset = 0
	}

	ctx := c.Request.Context()
	reviews, total, err := dal.GetReviews(ctx, appID, sentiment, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch reviews"})
		return
	}

	c.JSON(http.StatusOK, models.ReviewResponse{
		AppID:      appID,
		Reviews:    reviews,
		Total:      total,
		NextOffset: offset + len(reviews),
	})
}
