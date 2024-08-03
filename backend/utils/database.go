package utils

import (
    "log"
    "time"
    "gorm.io/driver/postgres"
    "gorm.io/gorm"
)

// Struct definitions
type User struct {
    ID        uint      `gorm:"primaryKey"`
    Username  string    `gorm:"unique"`
    Email     string    `gorm:"unique"`
    Password  string
    Role      string
    FullName  string
    Bio       string
    AvatarURL string
    CreatedAt time.Time
    UpdatedAt time.Time
    DeletedAt *time.Time `gorm:"index"`
}

type Room struct {
    ID              uint      `gorm:"primaryKey"`
    ColivingSpaceID uint      `gorm:"index"`
    RoomNumber      string    `gorm:"unique"`
    Description     string
    PricePerWeek    float64
    IsAvailable     bool
    CreatedAt       time.Time
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

type Message struct {
    ID         uint      `gorm:"primaryKey"`
    SenderID   uint      `gorm:"index"`
    ReceiverID uint      `gorm:"index"`
    Content    string
    CreatedAt  time.Time
}

type Group struct {
    ID          uint      `gorm:"primaryKey"`
    Name        string
    Description string
    CreatedAt   time.Time
}

type Event struct {
    ID        uint      `gorm:"primaryKey"`
    Name      string
    Details   string
    GroupID   uint      `gorm:"index"`
    CreatedAt time.Time
}

type ColivingSpace struct {
    ID          uint      `gorm:"primaryKey"`
    Name        string
    Address     string
    Description string
    CreatedAt   time.Time
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
    if err := DB.AutoMigrate(&User{}, &Room{}, &Booking{}, &Payment{}, &Session{}, &Message{}, &Group{}, &Event{}, &ColivingSpace{}); err != nil {
        log.Fatalf("Failed to migrate database schema: %v", err)
    }

    // Seed the database
    seedDatabase()
}

func seedDatabase() {
    // Seed Users
    users := []User{
        {Username: "yoon_hee", Email: "yoonhee@example.com", Password: "securepassword", Role: "user", FullName: "Yoon Hee", Bio: "Love traveling and meeting new people.", AvatarURL: "https://example.com/avatars/yoon_hee.png"},
        {Username: "james_smith", Email: "james.smith@example.com", Password: "securepassword", Role: "user", FullName: "James Smith", Bio: "An avid reader and coffee enthusiast.", AvatarURL: "https://example.com/avatars/james_smith.png"},
        {Username: "maria_garcia", Email: "maria.garcia@example.com", Password: "securepassword", Role: "user", FullName: "Maria Garcia", Bio: "Passionate about technology and innovation.", AvatarURL: "https://example.com/avatars/maria_garcia.png"},
        {Username: "john_doe", Email: "john.doe@example.com", Password: "securepassword", Role: "admin", FullName: "John Doe", Bio: "Admin of the HAUS platform.", AvatarURL: "https://example.com/avatars/john_doe.png"},
        {Username: "alice_jones", Email: "alice.jones@example.com", Password: "securepassword", Role: "user", FullName: "Alice Jones", Bio: "Music lover and artist.", AvatarURL: "https://example.com/avatars/alice_jones.png"},
        {Username: "bob_brown", Email: "bob.brown@example.com", Password: "securepassword", Role: "user", FullName: "Bob Brown", Bio: "Enjoys hiking and outdoor adventures.", AvatarURL: "https://example.com/avatars/bob_brown.png"},
        {Username: "carol_white", Email: "carol.white@example.com", Password: "securepassword", Role: "user", FullName: "Carol White", Bio: "Foodie and aspiring chef.", AvatarURL: "https://example.com/avatars/carol_white.png"},
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

    // Seed Messages
    messages := []Message{
        {SenderID: 1, ReceiverID: 2, Content: "Hey James! How's it going?", CreatedAt: time.Now().Add(-48 * time.Hour)},
        {SenderID: 2, ReceiverID: 1, Content: "Hi Yoon! I'm good, thanks. How about you?", CreatedAt: time.Now().Add(-47 * time.Hour)},
        {SenderID: 3, ReceiverID: 4, Content: "John, can we discuss the new feature?", CreatedAt: time.Now().Add(-46 * time.Hour)},
        {SenderID: 4, ReceiverID: 3, Content: "Sure, Maria. Let's set up a meeting.", CreatedAt: time.Now().Add(-45 * time.Hour)},
    }
    for _, message := range messages {
        var existingMessage Message
        if err := DB.Where("sender_id = ? AND receiver_id = ? AND content = ?", message.SenderID, message.ReceiverID, message.Content).First(&existingMessage).Error; err == nil {
            continue // Skip if message already exists
        }
        DB.Create(&message)
    }

    // Seed Groups
    groups := []Group{
        {Name: "Tech Enthusiasts", Description: "A group for people passionate about technology.", CreatedAt: time.Now().Add(-30 * 24 * time.Hour)},
        {Name: "Fitness Buffs", Description: "A group for fitness and health enthusiasts.", CreatedAt: time.Now().Add(-20 * 24 * time.Hour)},
    }
    for _, group := range groups {
        var existingGroup Group
        if err := DB.Where("name = ?", group.Name).First(&existingGroup).Error; err == nil {
            continue // Skip if group already exists
        }
        DB.Create(&group)
    }

    // Seed Events
    events := []Event{
        {Name: "Tech Talk", Details: "Discussion on the latest in tech.", GroupID: 1, CreatedAt: time.Now().Add(-10 * 24 * time.Hour)},
        {Name: "Morning Run", Details: "Join us for a morning run in the park.", GroupID: 2, CreatedAt: time.Now().Add(-5 * 24 * time.Hour)},
    }
    for _, event := range events {
        var existingEvent Event
        if err := DB.Where("name = ? AND group_id = ?", event.Name, event.GroupID).First(&existingEvent).Error; err == nil {
            continue // Skip if event already exists
        }
        DB.Create(&event)
    }

    // Seed Coliving Spaces
    colivingSpaces := []ColivingSpace{
        {Name: "Downtown Coliving", Address: "123 Main St, City, Country", Description: "A vibrant coliving space in the heart of the city.", CreatedAt: time.Now().Add(-15 * 24 * time.Hour)},
        {Name: "Seaside Retreat", Address: "456 Beach Ave, City, Country", Description: "A peaceful coliving space by the sea.", CreatedAt: time.Now().Add(-10 * 24 * time.Hour)},
    }
    for _, colivingSpace := range colivingSpaces {
        var existingColivingSpace ColivingSpace
        if err := DB.Where("name = ?", colivingSpace.Name).First(&existingColivingSpace).Error; err == nil {
            continue // Skip if coliving space already exists
        }
        DB.Create(&colivingSpace)
    }
}
