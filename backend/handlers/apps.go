package handlers

import (
	"context"
	"github.com/gin-gonic/gin"
	"net/http"
)

func GetApps(c *gin.Context) {
	ctx := context.Background() // or c.Request.Context() for real-world tracing

	apps, err := dal.GetApps(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to fetch apps",
		})
		return
	}
	c.JSON(http.StatusOK, apps)
}
