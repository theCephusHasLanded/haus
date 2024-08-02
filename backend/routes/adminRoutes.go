package routes

import (
    "github.com/gin-gonic/gin"
    "github.com/thecephushaslanded/haus/backend/controllers"
)

func AdminRoutes(router *gin.Engine) {
    admin := router.Group("/admin")
    admin.GET("/sessions", controllers.GetSessions)
    admin.POST("/sessions/:id/invalidate", controllers.InvalidateSession)
    admin.GET("/users", controllers.GetAllUsers)
    admin.POST("/users/:id/delete", controllers.DeleteUser)
}
