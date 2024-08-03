package routes

import (
    "github.com/gin-gonic/gin"
    "github.com/thecephushaslanded/haus/backend/controllers"
)

func MessageRoutes(router *gin.Engine) {
    message := router.Group("/messages")
    message.POST("/", controllers.SendMessage)
    message.GET("/:userID", controllers.GetMessages)
}
