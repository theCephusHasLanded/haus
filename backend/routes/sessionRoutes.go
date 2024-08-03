package routes

import (
    "github.com/gin-gonic/gin"
    "github.com/thecephushaslanded/haus/backend/controllers"
)

func SessionRoutes(router *gin.Engine) {
    session := router.Group("/admin/sessions")
    session.GET("/", controllers.GetSessions)
    session.POST("/:id/invalidate", controllers.InvalidateSession)
}
