package utils

import (
    "time"
    "log"
    "gorm.io/driver/postgres"
    "gorm.io/gorm"
)

// Struct definitions
type User struct {
    ID       uint   `gorm:"primaryKey"`
    Username string `gorm:"unique"`
    Email    string `gorm:"unique"`
    Password string
    Role     string
}

type Room struct {
    ID          uint    `gorm:"primaryKey"`
    RoomNumber  string  `gorm:"unique"`
    Description string
    PricePerWeek float64
    IsAvailable bool
}

type Booking struct {
    ID        uint      `gorm:"primaryKey"`
    UserID    uint      `gorm:"index"`
    RoomID    uint      `gorm:"index"`
    StartDate time.Time
    EndDate   time.Time
    Status    string
}

type Payment struct {
    ID            uint      `gorm:"primaryKey"`
    BookingID     uint      `gorm:"index"`
    Amount        float64
    PaymentDate   time.Time
    PaymentStatus string
}

var DB *gorm.DB
var err error

func InitDatabase() {
    dsn := "host=localhost user=haus_user password=securepassword dbname=haus_db port=5432 sslmode=disable TimeZone=Asia/Shanghai"
    DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatalf("Failed to connect to the database: %v", err)
    }

    // Migrate the schema
    if err := DB.AutoMigrate(&User{}, &Room{}, &Booking{}, &Payment{}); err != nil {
        log.Fatalf("Failed to migrate database schema: %v", err)
    }

    // Seed the database
    seedDatabase()
}

func seedDatabase() {
    // Seed Users
    users := []User{
        {Username: "yoon_hee", Email: "yoonhee@example.com", Password: "securepassword", Role: "user"},
        {Username: "james_smith", Email: "james.smith@example.com", Password: "securepassword", Role: "user"},
        {Username: "maria_garcia", Email: "maria.garcia@example.com", Password: "securepassword", Role: "user"},
    }
    for _, user := range users {
        var existingUser User
        if err := DB.Where("username = ?", user.Username).First(&existingUser).Error; err == nil {
            continue // Skip if user already exists
        }
        DB.Create(&user)
    }

    // Seed Rooms
    rooms := []Room{
        {RoomNumber: "101", Description: "Cozy single room with a beautiful view", PricePerWeek: 250.00, IsAvailable: true},
        {RoomNumber: "202", Description: "Modern double room with ensuite bathroom", PricePerWeek: 400.00, IsAvailable: true},
        {RoomNumber: "303", Description: "Luxurious suite with all amenities included", PricePerWeek: 1000.00, IsAvailable: true},
    }
    for _, room := range rooms {
        var existingRoom Room
        if err := DB.Where("room_number = ?", room.RoomNumber).First(&existingRoom).Error; err == nil {
            continue // Skip if room already exists
        }
        DB.Create(&room)
    }

    // Seed Bookings
    bookings := []Booking{
        {UserID: 1, RoomID: 1, StartDate: time.Date(2024, 8, 1, 0, 0, 0, 0, time.UTC), EndDate: time.Date(2024, 8, 7, 0, 0, 0, 0, time.UTC), Status: "confirmed"},
        {UserID: 2, RoomID: 2, StartDate: time.Date(2024, 8, 10, 0, 0, 0, 0, time.UTC), EndDate: time.Date(2024, 8, 15, 0, 0, 0, 0, time.UTC), Status: "confirmed"},
        {UserID: 3, RoomID: 3, StartDate: time.Date(2024, 8, 20, 0, 0, 0, 0, time.UTC), EndDate: time.Date(2024, 8, 27, 0, 0, 0, 0, time.UTC), Status: "confirmed"},
    }
    for _, booking := range bookings {
        var existingBooking Booking
        if err := DB.Where("user_id = ? AND room_id = ? AND start_date = ?", booking.UserID, booking.RoomID, booking.StartDate).First(&existingBooking).Error; err == nil {
            continue // Skip if booking already exists
        }
        DB.Create(&booking)
    }

    // Seed Payments
    payments := []Payment{
        {BookingID: 1, Amount: 250.00, PaymentDate: time.Date(2024, 8, 1, 0, 0, 0, 0, time.UTC), PaymentStatus: "paid"},
        {BookingID: 2, Amount: 400.00, PaymentDate: time.Date(2024, 8, 10, 0, 0, 0, 0, time.UTC), PaymentStatus: "paid"},
        {BookingID: 3, Amount: 1000.00, PaymentDate: time.Date(2024, 8, 20, 0, 0, 0, 0, time.UTC), PaymentStatus: "paid"},
    }
    for _, payment := range payments {
        var existingPayment Payment
        if err := DB.Where("booking_id = ? AND payment_date = ?", payment.BookingID, payment.PaymentDate).First(&existingPayment).Error; err == nil {
            continue // Skip if payment already exists
        }
        DB.Create(&payment)
    }
}
