package controllers

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "github.com/thecephushaslanded/haus/backend/utils"
)

func GetSessions(c *gin.Context) {
    var sessions []utils.Session
    if err := utils.DB.Find(&sessions).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, sessions)
}

func InvalidateSession(c *gin.Context) {
    sessionId := c.Param("id")
    if err := utils.DB.Where("id = ?", sessionId).Delete(&utils.Session{}).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "Session invalidated successfully"})
}