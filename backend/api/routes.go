package api

import (
	"github.com/aribhuiya/backend/handlers"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.Engine) {
	router.GET("/apps", handlers.GetApps)
	router.POST("/queue", handlers.PostQueue)

	results := router.Group("/results/:app_id")
	{
		results.GET("/sentiment-over-time", handlers.GetSentimentOverTime)
		results.GET("/keywords", handlers.GetKeywords)
		results.GET("/themes", handlers.GetThemes)
		results.GET("/reviews", handlers.GetReviews)
		results.GET("/ratings-distribution", handlers.GetRatingsDistribution)
	}

}
