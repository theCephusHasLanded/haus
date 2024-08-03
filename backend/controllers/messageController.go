package controllers

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "github.com/thecephushaslanded/haus/backend/utils"
    "github.com/thecephushaslanded/haus/backend/models"
)

func SendMessage(c *gin.Context) {
    var message models.Message
    if err := c.ShouldBindJSON(&message); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
        return
    }
    if err := utils.DB.Create(&message).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send message"})
        return
    }
    c.JSON(http.StatusCreated, message)
}

func GetMessages(c *gin.Context) {
    userID := c.Param("userID")
    var messages []models.Message
    if err := utils.DB.Where("receiver_id = ?", userID).Or("sender_id = ?", userID).Find(&messages).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve messages"})
        return
    }
    c.JSON(http.StatusOK, messages)
}
