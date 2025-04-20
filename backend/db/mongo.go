package db

import (
	"context"
	"log"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/aribhuiya/backend/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var client *mongo.Client
var database *mongo.Database

type MongoDAL struct {
	db *mongo.Database
}

func NewMongoDAL() *MongoDAL {
	uri := os.Getenv("MONGO_URI")
	dbName := os.Getenv("MONGO_DB_NAME")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	clientOpts := options.Client().ApplyURI(uri)
	client, err := mongo.Connect(ctx, clientOpts)
	if err != nil {
		log.Fatalf("Failed to connect to Mongo: %v", err)
	}
	if err := client.Ping(ctx, nil); err != nil {
		log.Fatalf("Mongo ping failed: %v", err)
	}
	log.Println("Connected to MongoDB")

	return &MongoDAL{
		db: client.Database(dbName),
	}
}

func (m *MongoDAL) GetApps(ctx context.Context) ([]models.App, error) {
	coll := m.db.Collection("apps")

	cursor, err := coll.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer func(cursor *mongo.Cursor, ctx context.Context) {
		_ = cursor.Close(ctx)
	}(cursor, ctx)

	var apps []models.App
	if err := cursor.All(ctx, &apps); err != nil {
		return nil, err
	}
	return apps, nil
}

func (m *MongoDAL) GetTopKeywords(ctx context.Context, appID string, limit int) ([]models.KeywordEntry, error) {
	coll := m.db.Collection("sentiments_metadata")

	var result struct {
		AppID       string                `bson:"app_id"`
		TopKeywords []models.KeywordEntry `bson:"top_keywords"`
	}

	err := coll.FindOne(ctx, bson.M{"app_id": appID}).Decode(&result)
	if err != nil {
		return nil, err
	}

	// apply limit at the Go level (Mongo returns full list)
	if len(result.TopKeywords) > limit {
		result.TopKeywords = result.TopKeywords[:limit]
	}

	return result.TopKeywords, nil
}

func (m *MongoDAL) GetTopThemes(ctx context.Context, appID string, limit int) ([]models.ThemeEntry, error) {
	coll := m.db.Collection("sentiments_metadata")

	var result struct {
		AppID     string              `bson:"app_id"`
		TopThemes []models.ThemeEntry `bson:"top_themes"`
	}

	err := coll.FindOne(ctx, bson.M{"app_id": appID}).Decode(&result)
	if err != nil {
		return nil, err
	}

	if len(result.TopThemes) > limit {
		result.TopThemes = result.TopThemes[:limit]
	}

	return result.TopThemes, nil
}

func (m *MongoDAL) GetRatingsDistribution(ctx context.Context, appID string) (map[string]int, int, error) {
	coll := m.db.Collection("sentiments")

	pipeline := mongo.Pipeline{
		{{Key: "$match", Value: bson.D{{Key: "app_id", Value: appID}}}},
		{{Key: "$group", Value: bson.D{
			{Key: "_id", Value: "$rating"},
			{Key: "count", Value: bson.D{{Key: "$sum", Value: 1}}},
		}}},
	}

	cursor, err := coll.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, 0, err
	}
	defer cursor.Close(ctx)

	dist := map[string]int{}
	total := 0

	for cursor.Next(ctx) {
		var entry struct {
			Rating int `bson:"_id"`
			Count  int `bson:"count"`
		}
		if err := cursor.Decode(&entry); err != nil {
			continue
		}
		dist[strconv.Itoa(entry.Rating)] = entry.Count
		total += entry.Count
	}

	return dist, total, nil
}

func (m *MongoDAL) GetSentimentOverTime(ctx context.Context, appID string) ([]models.SentimentTimePoint, error) {
	coll := m.db.Collection("sentiments")

	pipeline := mongo.Pipeline{
		{{Key: "$match", Value: bson.D{{Key: "app_id", Value: appID}}}},
		{{Key: "$group", Value: bson.D{
			{Key: "_id", Value: bson.M{
				"$dateToString": bson.M{
					"format": "%Y-%m",
					"date":   bson.M{"$toDate": "$timestamp"}, //"$timestamp" if datetime in mongo,
				},
			}},
			{Key: "avg_sentiment", Value: bson.M{"$avg": "$sentiment_score"}},
			{Key: "review_count", Value: bson.M{"$sum": 1}},
		}}},
		{{Key: "$sort", Value: bson.D{{Key: "_id", Value: 1}}}},
	}

	cursor, err := coll.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, err
	}
	defer func(cursor *mongo.Cursor, ctx context.Context) {
		_ = cursor.Close(ctx)
	}(cursor, ctx)

	var results []models.SentimentTimePoint
	for cursor.Next(ctx) {
		var entry struct {
			Month        string  `bson:"_id"`
			AvgSentiment float64 `bson:"avg_sentiment"`
			ReviewCount  int     `bson:"review_count"`
		}
		if err := cursor.Decode(&entry); err != nil {
			continue
		}
		results = append(results, models.SentimentTimePoint(entry))
	}

	return results, nil
}

func (m *MongoDAL) GetReviews(ctx context.Context, appID, sentiment string, limit, offset int) ([]models.ReviewEntry, int, error) {
	coll := m.db.Collection("sentiments")
	filter := bson.M{"app_id": appID}
	if sentiment != "all" {
		filter["sentiment_label"] = strings.ToUpper(sentiment)
	}

	opts := options.Find().
		SetSort(bson.D{{Key: "timestamp", Value: -1}}).
		SetSkip(int64(offset)).
		SetLimit(int64(limit))

	cursor, err := coll.Find(ctx, filter, opts)
	if err != nil {
		return nil, 0, err
	}
	defer cursor.Close(ctx)

	var results []models.ReviewEntry
	for cursor.Next(ctx) {
		var raw struct {
			Text      string `bson:"text"`
			Rating    int    `bson:"rating"`
			Timestamp string `bson:"timestamp"`
			Sentiment string `bson:"sentiment_label"`
		}
		if err := cursor.Decode(&raw); err != nil {
			continue
		}

		// Format date
		date := raw.Timestamp
		if t, err := time.Parse(time.RFC3339, raw.Timestamp); err == nil {
			date = t.Format("2006-01-02")
		}

		results = append(results, models.ReviewEntry{
			Text:      raw.Text,
			Rating:    raw.Rating,
			Sentiment: strings.Title(strings.ToLower(raw.Sentiment)),
			Date:      date,
		})
	}
	total, _ := coll.CountDocuments(ctx, filter)
	return results, int(total), nil
}
