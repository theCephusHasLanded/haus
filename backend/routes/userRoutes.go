package routes

import (
    "github.com/gin-gonic/gin"
    "github.com/thecephushaslanded/haus/backend/controllers"
)

func UserRoutes(router *gin.Engine) {
    router.GET("/users", controllers.GetUsers)
    router.POST("/users", controllers.CreateUser)

    
}
