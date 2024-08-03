package controllers

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "github.com/thecephushaslanded/haus/backend/utils"
)

func GetAllUsers(c *gin.Context) {
    var users []utils.User
    if err := utils.DB.Find(&users).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, users)
}

func DeleteUser(c *gin.Context) {
    userId := c.Param("id")
    if err := utils.DB.Where("id = ?", userId).Delete(&utils.User{}).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}

func RestoreUser(c *gin.Context) {
    userId := c.Param("id")
    if err := utils.DB.Unscoped().Model(&utils.User{}).Where("id = ?", userId).Update("deleted_at", nil).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "User restored successfully"})
}
