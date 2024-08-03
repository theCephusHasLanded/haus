package middleware

import (
    "github.com/gin-gonic/gin"
    "github.com/thecephushaslanded/haus/backend/utils"
    "net/http"
    "time"
)

func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        tokenString := c.GetHeader("Authorization")
        if tokenString == "" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Request does not contain an access token"})
            c.Abort()
            return
        }

        claims, err := utils.ValidateJWT(tokenString)
        if err != nil || claims.Valid() != nil {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
            c.Abort()
            return
        }

        sessionKey := "session:" + claims.Username
        sessionData := map[string]interface{}{
            "ID":         claims.ID,
            "Username":   claims.Username,
            "LastActive": time.Now().Format(time.RFC3339),
        }
        utils.RedisClient.HMSet(utils.Ctx, sessionKey, sessionData)
        utils.RedisClient.Expire(utils.Ctx, sessionKey, 24*time.Hour)

        c.Set("username", claims.Username)
        c.Next()
    }
}
