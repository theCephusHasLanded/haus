package main

import (
	"fmt"
	"net/http"
	"time"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/thecephushaslanded/haus/backend/routes"
	"github.com/thecephushaslanded/haus/backend/utils"
	"gorm.io/gorm"
)

var db *gorm.DB
var err error

func main() {
    // Initialize Gin
    router := gin.Default()

    // Configure CORS
    router.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"*"},
        AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
        AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Authorization"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
        MaxAge:           12 * time.Hour,
    }))

    // Initialize Database
    utils.InitDatabase()
    utils.InitRedis()

    // Define routes
    routes.AuthRoutes(router)
    routes.AdminRoutes(router)
    routes.UserRoutes(router)
    routes.RoomRoutes(router)
    routes.ColivingRoutes(router)
    routes.CommunityRoutes(router)
    // routes.SessionRoutes(router)


    authorized := router.Group("/")
    authorized.Use(authMiddleware())
    {
        authorized.GET("/rooms", getRooms)
        authorized.POST("/rooms", createRoom)
        authorized.GET("/bookings", getBookings)
        authorized.POST("/bookings", createBooking)
        authorized.GET("/payments", getPayments)
        authorized.POST("/payments", createPayment)
    }

    router.Run(":8080") // Gin server on port 8080
}

// Middleware to protect routes
func authMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        tokenString := c.GetHeader("Authorization")
        tokenString = strings.TrimPrefix(tokenString, "Bearer ")
        fmt.Println("Received token:", tokenString)
        if tokenString == "" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing authorization token"})
            c.Abort()
            return
        }

        claims, err := utils.ValidateJWT(tokenString)
        if err != nil {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
            c.Abort()
            return
        }

        c.Set("username", claims.Username)
        c.Next()
    }
}

// Handler function to get all users
func getUsers(c *gin.Context) {
    var users []utils.User
    if result := utils.DB.Find(&users); result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }
    c.JSON(http.StatusOK, users)
}

// Handler function to create a new user
func createUser(c *gin.Context) {
    var user utils.User
    if err := c.ShouldBindJSON(&user); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    if result := utils.DB.Create(&user); result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }
    c.JSON(http.StatusCreated, user)
}

// Handler function to get all rooms
func getRooms(c *gin.Context) {
    var rooms []utils.Room
    if result := utils.DB.Find(&rooms); result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }
    c.JSON(http.StatusOK, rooms)
}

// Handler function to create a new room
func createRoom(c *gin.Context) {
    var room utils.Room
    if err := c.ShouldBindJSON(&room); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    if result := utils.DB.Create(&room); result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }
    c.JSON(http.StatusCreated, room)
}

// Handler function to get all bookings
func getBookings(c *gin.Context) {
    var bookings []utils.Booking
    if result := utils.DB.Find(&bookings); result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }
    c.JSON(http.StatusOK, bookings)
}

// Handler function to create a new booking
func createBooking(c *gin.Context) {
    var booking utils.Booking
    if err := c.ShouldBindJSON(&booking); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    if result := utils.DB.Create(&booking); result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }
    c.JSON(http.StatusCreated, booking)
}

// Handler function to get all payments
func getPayments(c *gin.Context) {
    var payments []utils.Payment
    if result := utils.DB.Find(&payments); result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }
    c.JSON(http.StatusOK, payments)
}

// Handler function to create a new payment
func createPayment(c *gin.Context) {
    var payment utils.Payment
    if err := c.ShouldBindJSON(&payment); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    if result := utils.DB.Create(&payment); result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }
    c.JSON(http.StatusCreated, payment)
}
