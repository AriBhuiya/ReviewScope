package main

import (
	"github.com/aribhuiya/backend/api"
	"github.com/aribhuiya/backend/db"
	"github.com/aribhuiya/backend/handlers"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"log"
	_ "net/http"
	"os"
)

func init() {
	// Load .env file if present; otherwise read from environment directly — ignore errors.
	_ = godotenv.Load()
}

func main() {
	mongoDAL := db.NewMongoDAL()
	handlers.SetDAL(mongoDAL)
	router := gin.Default()

	// Register all routes
	api.RegisterRoutes(router)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Println("🚀 Server starting at :8080")
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
