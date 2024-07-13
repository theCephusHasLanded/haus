package main

import (
    "github.com/gin-gonic/gin"
    "gorm.io/driver/postgres"
    "gorm.io/gorm"
    "net/http"
)

var db *gorm.DB
var err error

type User struct {
    ID    uint   `json:"id" gorm:"primaryKey"`
    Name  string `json:"name"`
    Email string `json:"email"`
}

func main() {
    // Initialize Gin
    router := gin.Default()

    // Connect to PostgreSQL database
    dsn := "host=localhost user=username password=password dbname=mydb port=5432 sslmode=disable TimeZone=Asia/Shanghai"
    db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        panic("Failed to connect to the database")
    }

    // Migrate the schema
    db.AutoMigrate(&User{})

    // Define routes
    router.GET("/", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "message": "Hello, Gin with GORM!",
        })
    })

    router.GET("/users", func(c *gin.Context) {
        var users []User
        db.Find(&users)
        c.JSON(http.StatusOK, users)
    })

    router.POST("/users", func(c *gin.Context) {
        var user User
        if err := c.ShouldBindJSON(&user); err != nil {
            c.JSON(http.StatusBadRequest, err.Error())
            return
        }
        db.Create(&user)
        c.JSON(http.StatusCreated, user)
    })

    router.Run(":8080") // Gin server on port 8080
}
