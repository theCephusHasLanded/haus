package controllers

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "github.com/thecephushaslanded/haus/backend/utils"
)

type RegisterRequest struct {
    Username string `json:"username" binding:"required"`
    Email    string `json:"email" binding:"required,email"`
    Password string `json:"password" binding:"required"`
    Code     string `json:"code"`
}

func RegisterUser(c *gin.Context) {
    var request RegisterRequest
    if err := c.ShouldBindJSON(&request); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    role := "user"
    if request.Code == "7777" {
        role = "admin"
    }

    user := utils.User{
        Username: request.Username,
        Email:    request.Email,
        Password: request.Password,
        Role:     role,
    }

    if err := utils.DB.Create(&user).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully", "user": user})
}

func LoginUser(c *gin.Context) {
    var user utils.User
    if err := c.ShouldBindJSON(&user); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
        return
    }

    var foundUser utils.User
    if err := utils.DB.Where("username = ? AND password = ?", user.Username, user.Password).First(&foundUser).Error; err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
        return
    }

    token, err := utils.GenerateJWT(foundUser.Username, foundUser.Role)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"token": token, "username": foundUser.Username, "role": foundUser.Role})
}
