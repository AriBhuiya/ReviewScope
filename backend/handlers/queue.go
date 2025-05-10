package handlers

import (
	"bytes"
	"context"
	"encoding/json"
	"github.com/aribhuiya/backend/models"
	"github.com/gin-gonic/gin"
	"io"
	"net/http"
	"os"
	"time"
)

func SubmitAppToQueue(c *gin.Context) {
	var req models.QueueRequest
	QueueUri := os.Getenv("QUEUE_URI")
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request body",
		})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	bodyBytes, err := json.Marshal(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to serialize request"})
		return
	}

	httpReq, err := http.NewRequestWithContext(ctx, "POST", QueueUri+"/queue/add", bytes.NewReader(bodyBytes))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create request"})
		return
	}
	httpReq.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(httpReq)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to reach queue service"})
		return
	}
	defer func(Body io.ReadCloser) {
		_ = Body.Close()
	}(resp.Body)

	var queueResponse map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&queueResponse); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid response from queue"})
		return
	}

	c.JSON(resp.StatusCode, queueResponse)
}

func proxyGETToQueue(c *gin.Context, path string) {
	queueURI := os.Getenv("QUEUE_URI")
	fullURL := queueURI + path

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	req, err := http.NewRequestWithContext(ctx, "GET", fullURL, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create request"})
		return
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to reach queue service"})
		return
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid response from queue"})
		return
	}

	c.JSON(resp.StatusCode, result)
}

// GetAppStatus GET /queue/status/:app_id
func GetAppStatus(c *gin.Context) {
	appID := c.Param("app_id")
	proxyGETToQueue(c, "/queue/status/"+appID)
}

// GetQueueOverview GET /queue/overview
func GetQueueOverview(c *gin.Context) {
	proxyGETToQueue(c, "/queue/overview")
}
