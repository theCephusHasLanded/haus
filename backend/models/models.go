package models

import "time"

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

type ColivingSpace struct {
    ID          uint      `gorm:"primaryKey"`
    Name        string
    Address     string
    Description string
    CreatedAt   time.Time
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
