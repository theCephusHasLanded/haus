package utils

import (
    "context"
    redis "github.com/redis/go-redis/v9"
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
