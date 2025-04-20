package handlers

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func PostQueue(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "queued",
		"message": "This is a stub. Queue logic goes here.",
	})
}
