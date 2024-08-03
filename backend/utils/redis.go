package utils

import (
    "context"
    "github.com/go-redis/redis/v8"
    "log"
)

var RedisClient *redis.Client
var Ctx = context.Background()

func InitRedis() {
    RedisClient = redis.NewClient(&redis.Options{
        Addr:     "localhost:6379", // Redis server address
        Password: "",               // No password set
        DB:       0,                // Use default DB
    })

    _, err := RedisClient.Ping(Ctx).Result()
    if err != nil {
        log.Fatalf("Failed to connect to Redis: %v", err)
    }
}
