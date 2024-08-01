package utils

import (
    "log"
    "time"
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

type Session struct {
    ID         uint      `gorm:"primaryKey"`
    UserID     uint      `gorm:"index"`
    Username   string
    LastActive time.Time
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
    if err := DB.AutoMigrate(&User{}, &Room{}, &Booking{}, &Payment{}, &Session{}); err != nil {
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
        {Username: "john_doe", Email: "john.doe@example.com", Password: "securepassword", Role: "admin"},
        {Username: "alice_jones", Email: "alice.jones@example.com", Password: "securepassword", Role: "user"},
        {Username: "bob_brown", Email: "bob.brown@example.com", Password: "securepassword", Role: "user"},
        {Username: "carol_white", Email: "carol.white@example.com", Password: "securepassword", Role: "user"},
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
        {RoomNumber: "404", Description: "Spacious family room with a balcony", PricePerWeek: 700.00, IsAvailable: true},
        {RoomNumber: "505", Description: "Elegant room with a king-sized bed", PricePerWeek: 600.00, IsAvailable: true},
        {RoomNumber: "606", Description: "Compact room with essential amenities", PricePerWeek: 200.00, IsAvailable: true},
        {RoomNumber: "707", Description: "Premium suite with a city view", PricePerWeek: 1200.00, IsAvailable: true},
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
        {UserID: 4, RoomID: 4, StartDate: time.Date(2024, 8, 1, 0, 0, 0, 0, time.UTC), EndDate: time.Date(2024, 8, 7, 0, 0, 0, 0, time.UTC), Status: "pending"},
        {UserID: 5, RoomID: 5, StartDate: time.Date(2024, 8, 10, 0, 0, 0, 0, time.UTC), EndDate: time.Date(2024, 8, 15, 0, 0, 0, 0, time.UTC), Status: "cancelled"},
        {UserID: 6, RoomID: 6, StartDate: time.Date(2024, 8, 5, 0, 0, 0, 0, time.UTC), EndDate: time.Date(2024, 8, 12, 0, 0, 0, 0, time.UTC), Status: "confirmed"},
        {UserID: 7, RoomID: 7, StartDate: time.Date(2024, 8, 15, 0, 0, 0, 0, time.UTC), EndDate: time.Date(2024, 8, 20, 0, 0, 0, 0, time.UTC), Status: "confirmed"},
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
        {BookingID: 4, Amount: 700.00, PaymentDate: time.Date(2024, 8, 1, 0, 0, 0, 0, time.UTC), PaymentStatus: "pending"},
        {BookingID: 5, Amount: 600.00, PaymentDate: time.Date(2024, 8, 10, 0, 0, 0, 0, time.UTC), PaymentStatus: "cancelled"},
        {BookingID: 6, Amount: 200.00, PaymentDate: time.Date(2024, 8, 5, 0, 0, 0, 0, time.UTC), PaymentStatus: "paid"},
        {BookingID: 7, Amount: 1200.00, PaymentDate: time.Date(2024, 8, 15, 0, 0, 0, 0, time.UTC), PaymentStatus: "paid"},
    }
    for _, payment := range payments {
        var existingPayment Payment
        if err := DB.Where("booking_id = ? AND payment_date = ?", payment.BookingID, payment.PaymentDate).First(&existingPayment).Error; err == nil {
            continue // Skip if payment already exists
        }
        DB.Create(&payment)
    }

       // Seed Sessions
       sessions := []Session{
        {UserID: 1, Username: "yoon_hee", LastActive: time.Now().Add(-time.Hour)},
        {UserID: 2, Username: "james_smith", LastActive: time.Now().Add(-2 * time.Hour)},
        {UserID: 3, Username: "maria_garcia", LastActive: time.Now().Add(-3 * time.Hour)},
        {UserID: 4, Username: "john_doe", LastActive: time.Now().Add(-4 * time.Hour)},
        {UserID: 5, Username: "alice_jones", LastActive: time.Now().Add(-5 * time.Hour)},
        {UserID: 6, Username: "bob_brown", LastActive: time.Now().Add(-6 * time.Hour)},
        {UserID: 7, Username: "carol_white", LastActive: time.Now().Add(-7 * time.Hour)},
    }
    for _, session := range sessions {
        var existingSession Session
        if err := DB.Where("user_id = ?", session.UserID).First(&existingSession).Error; err == nil {
            continue // Skip if session already exists
        }
        DB.Create(&session)
    }
}
