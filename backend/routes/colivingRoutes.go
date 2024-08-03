package routes

import (
    "github.com/gin-gonic/gin"
    "github.com/thecephushaslanded/haus/backend/controllers"
)

func ColivingRoutes(router *gin.Engine) {
    router.GET("/coliving/spaces", controllers.GetColivingSpaces)
    router.GET("/coliving/spaces/:id", controllers.GetColivingSpaceByID)
}
