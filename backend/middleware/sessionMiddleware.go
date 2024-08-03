package middleware

import (
    "encoding/json"
    "github.com/gin-gonic/gin"
    "github.com/thecephushaslanded/haus/backend/utils"
    "net/http"
    "strings"
    "fmt"
    "time"
)

func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        tokenString := c.GetHeader("Authorization")
        tokenString = strings.TrimPrefix(tokenString, "Bearer ")
        fmt.Println("Received token:", tokenString)
        if tokenString == "" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing authorization token"})
            c.Abort()
            return
        }

        claims, err := utils.ValidateJWT(tokenString)
        if err != nil {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
            c.Abort()
            return
        }

        sessionKey := "session:" + claims.Username
        sessionData := map[string]interface{}{
            "Username":   claims.Username,
            "Role":       claims.Role,
            "LastActive": time.Now().Format(time.RFC3339),
        }
        sessionDataJSON, _ := json.Marshal(sessionData)
        utils.RedisClient.Set(utils.Ctx, sessionKey, sessionDataJSON, 24*time.Hour)

        // Add session key to active sessions set
        utils.RedisClient.SAdd(utils.Ctx, "active_sessions", sessionKey)

        c.Set("username", claims.Username)
        c.Next()
    }
}
