package controllers

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "github.com/thecephushaslanded/haus/backend/utils"
    "github.com/thecephushaslanded/haus/backend/models"
)

func CreateGroup(c *gin.Context) {
    var group models.Group
    if err := c.ShouldBindJSON(&group); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
        return
    }
    if err := utils.DB.Create(&group).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create group"})
        return
    }
    c.JSON(http.StatusCreated, group)
}

func GetGroups(c *gin.Context) {
    var groups []models.Group
    if err := utils.DB.Find(&groups).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve groups"})
        return
    }
    c.JSON(http.StatusOK, groups)
}

func CreateEvent(c *gin.Context) {
    var event models.Event
    if err := c.ShouldBindJSON(&event); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
        return
    }
    if err := utils.DB.Create(&event).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create event"})
        return
    }
    c.JSON(http.StatusCreated, event)
}

func GetEvents(c *gin.Context) {
    var events []models.Event
    if err := utils.DB.Find(&events).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve events"})
        return
    }
    c.JSON(http.StatusOK, events)
}
