package routes

import (
    "github.com/gin-gonic/gin"
    "github.com/thecephushaslanded/haus/backend/controllers"
)

func AuthRoutes(router *gin.Engine) {
    router.POST("/register", controllers.RegisterUser)
    router.POST("/login", controllers.LoginUser)
}
