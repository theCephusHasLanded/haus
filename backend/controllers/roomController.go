package controllers

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "github.com/thecephushaslanded/haus/backend/utils"
)

func GetRooms(c *gin.Context) {
    var rooms []utils.Room
    if err := utils.DB.Find(&rooms).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve rooms"})
        return
    }
    c.JSON(http.StatusOK, rooms)
}

func GetRoomByID(c *gin.Context) {
    var room utils.Room
    if err := utils.DB.First(&room, c.Param("id")).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Room not found"})
        return
    }
    c.JSON(http.StatusOK, room)
}
