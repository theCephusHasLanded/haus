package routes

import (
    "github.com/gin-gonic/gin"
    "github.com/thecephushaslanded/haus/backend/controllers"
)

func ColivingRoutes(router *gin.Engine) {
    coliving := router.Group("/coliving")
    coliving.POST("/spaces", controllers.CreateColivingSpace)
    coliving.GET("/spaces", controllers.GetColivingSpaces)
    coliving.POST("/rooms", controllers.CreateRoom)
    coliving.GET("/rooms", controllers.GetRooms)
}
