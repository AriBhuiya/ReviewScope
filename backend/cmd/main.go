package main

import (
	"github.com/aribhuiya/backend/api"
	"github.com/aribhuiya/backend/db"
	"github.com/aribhuiya/backend/handlers"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"log"
	_ "net/http"
	"os"
	"time"
)

func init() {
	// Load .env file if present; otherwise read from environment directly — ignore errors.
	_ = godotenv.Load()
}

func main() {
	mongoDAL := db.NewMongoDAL()
	handlers.SetDAL(mongoDAL)

	allowedOrigin := os.Getenv("FRONTEND_ORIGIN")
	if allowedOrigin == "" {
		allowedOrigin = "http://localhost:5143"
	}

	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{allowedOrigin},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
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
