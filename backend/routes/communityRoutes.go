package routes

import (
    "github.com/gin-gonic/gin"
    "github.com/thecephushaslanded/haus/backend/controllers"
)

func CommunityRoutes(router *gin.Engine) {
    community := router.Group("/community")
    community.POST("/groups", controllers.CreateGroup)
    community.GET("/groups", controllers.GetGroups)
    community.POST("/events", controllers.CreateEvent)
    community.GET("/events", controllers.GetEvents)
}
