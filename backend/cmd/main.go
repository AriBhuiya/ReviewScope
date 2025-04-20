package main

import (
	"github.com/aribhuiya/backend/api"
	"github.com/aribhuiya/backend/db"
	"github.com/aribhuiya/backend/handlers"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"log"
	_ "net/http"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	mongoDAL := db.NewMongoDAL()
	handlers.SetDAL(mongoDAL)
	router := gin.Default()

	// Register all routes
	api.RegisterRoutes(router)

	log.Println("🚀 Server starting at :8080")
	if err := router.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
