package controllers

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "github.com/thecephushaslanded/haus/backend/models"
    "github.com/thecephushaslanded/haus/backend/utils"
)

func CreateColivingSpace(c *gin.Context) {
    var space models.ColivingSpace
    if err := c.ShouldBindJSON(&space); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
        return
    }
    if err := utils.DB.Create(&space).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create coliving space"})
        return
    }
    c.JSON(http.StatusCreated, space)
}

func GetColivingSpaces(c *gin.Context) {
    var spaces []models.ColivingSpace
    if err := utils.DB.Find(&spaces).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve coliving spaces"})
        return
    }
    c.JSON(http.StatusOK, spaces)
}

func CreateRoom(c *gin.Context) {
    var room models.Room
    if err := c.ShouldBindJSON(&room); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
        return
    }
    if err := utils.DB.Create(&room).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create room"})
        return
    }
    c.JSON(http.StatusCreated, room)
}

func GetRooms(c *gin.Context) {
    var rooms []models.Room
    if err := utils.DB.Find(&rooms).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve rooms"})
        return
    }
    c.JSON(http.StatusOK, rooms)
}
