package controllers

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "github.com/thecephushaslanded/haus/backend/utils"
)

func GetSessions(c *gin.Context) {
    var sessions []utils.Session
    if err := utils.DB.Find(&sessions).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve sessions"})
        return
    }
    c.JSON(http.StatusOK, sessions)
}

func InvalidateSession(c *gin.Context) {
    var session utils.Session
    if err := utils.DB.First(&session, c.Param("id")).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Session not found"})
        return
    }
    if err := utils.DB.Delete(&session).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to invalidate session"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "Session invalidated successfully"})
}
