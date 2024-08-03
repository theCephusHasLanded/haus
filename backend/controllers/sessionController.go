package controllers

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "github.com/thecephushaslanded/haus/backend/utils"
)

func GetSessions(c *gin.Context) {
    var sessions []utils.Session
    keys, err := utils.RedisClient.Keys(utils.Ctx, "session:*").Result()
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    for _, key := range keys {
        var session utils.Session
        err := utils.RedisClient.HGetAll(utils.Ctx, key).Scan(&session)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        sessions = append(sessions, session)
    }

    c.JSON(http.StatusOK, sessions)
}

func InvalidateSession(c *gin.Context) {
    sessionId := c.Param("id")
    err := utils.RedisClient.Del(utils.Ctx, "session:"+sessionId).Err()
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Session invalidated successfully"})
}
