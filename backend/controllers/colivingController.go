package controllers

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "github.com/thecephushaslanded/haus/backend/utils"
)

func GetColivingSpaces(c *gin.Context) {
    var spaces []utils.ColivingSpace
    if err := utils.DB.Find(&spaces).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve coliving spaces"})
        return
    }
    c.JSON(http.StatusOK, spaces)
}

func GetColivingSpaceByID(c *gin.Context) {
    var space utils.ColivingSpace
    if err := utils.DB.First(&space, c.Param("id")).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Coliving space not found"})
        return
    }
    c.JSON(http.StatusOK, space)
}
