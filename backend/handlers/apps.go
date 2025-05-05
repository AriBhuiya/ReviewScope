package handlers

import (
	"context"
	"fmt"
	"github.com/aribhuiya/backend/models"
	"github.com/gin-gonic/gin"
	"io"
	"net/http"
	"time"
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
	if apps == nil {
		apps = []models.App{}
	}
	c.JSON(http.StatusOK, apps)
}

// ValidateAppID ValidateAppIDHandler checks if a Play Store app ID exists
func ValidateAppID(c *gin.Context) {
	appID := c.Query("app_id")
	if appID == "" {
		c.JSON(http.StatusBadRequest, models.ValidateResponse{
			Valid: false,
			Error: "Missing app_id",
		})
		return
	}
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	url := fmt.Sprintf("https://play.google.com/store/apps/details?id=%s&hl=en", appID)
	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ValidateResponse{
			Valid: false,
			Error: "Failed to create request",
		})
		return
	}
	// fake browser
	req.Header.Set("User-Agent", "Mozilla/5.0 (compatible; ReviewScopeBot/1.0)")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ValidateResponse{
			Valid: false,
			Error: "Failed to connect to Google Play",
		})
		return
	}
	defer func(Body io.ReadCloser) {
		_ = Body.Close()
	}(resp.Body)

	if resp.StatusCode == http.StatusOK {
		c.JSON(http.StatusOK, models.ValidateResponse{
			Valid: true,
		})
	} else {
		c.JSON(http.StatusOK, models.ValidateResponse{
			Valid: false,
			Error: fmt.Sprintf("Unknown_App_ID"),
		})
	}
}
