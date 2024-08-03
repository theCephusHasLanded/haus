package routes

import (
    "github.com/gin-gonic/gin"
    "github.com/thecephushaslanded/haus/backend/controllers"
)

func RoomRoutes(router *gin.Engine) {
    room := router.Group("/rooms")
    room.GET("/", controllers.GetRooms)
    room.GET("/:id", controllers.GetRoomByID)
}
