package utils

import (
    validator "github.com/go-playground/validator/v10"
    "github.com/gin-gonic/gin"
    "net/http"
)

var validate *validator.Validate

func InitValidator() {
    validate = validator.New()
}

func ValidateStruct(obj interface{}) gin.HandlerFunc {
    return func(c *gin.Context) {
        if err := c.ShouldBindJSON(obj); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            c.Abort()
            return
        }
        if err := validate.Struct(obj); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            c.Abort()
            return
        }
        c.Next()
    }
}
