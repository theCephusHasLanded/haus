package routes

import (
    "github.com/gin-gonic/gin"
    "github.com/thecephushaslanded/haus/backend/controllers"
)

func UserRoutes(router *gin.Engine) {
    router.GET("/users", controllers.GetUsers)
    router.GET("/users/:id", controllers.GetUserByID)
    router.PUT("/users/:id", controllers.UpdateUser)
    router.GET("/current-user/:username", controllers.GetCurrentUser) // Add this line
}
