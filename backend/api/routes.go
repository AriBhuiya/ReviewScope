package api

import (
	"github.com/aribhuiya/backend/handlers"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.Engine) {
	router.GET("/apps", handlers.GetApps)
	router.GET("/apps/validate-google-app-id", handlers.ValidateAppID)
	router.POST("/queue/add", handlers.SubmitAppToQueue)
	queueGroup := router.Group("/queue")
	{
		router.POST("/add", handlers.SubmitAppToQueue)
		queueGroup.GET("/status/:app_id", handlers.GetAppStatus)
		queueGroup.GET("/overview", handlers.GetQueueOverview)
	}

	results := router.Group("/results/:app_id")
	{
		results.GET("/sentiment-over-time", handlers.GetSentimentOverTime)
		results.GET("/keywords", handlers.GetKeywords)
		results.GET("/themes", handlers.GetThemes)
		results.GET("/reviews", handlers.GetReviews)
		results.GET("/ratings-distribution", handlers.GetRatingsDistribution)
	}

}
