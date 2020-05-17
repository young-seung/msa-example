package entity

import "time"

// Account account entity for database table
type Account struct {
	ID        string    `gorm:"primary_key;not null"`
	Email     string    `gorm:"unique;not null"`
	Password  string    `gorm:"not null"`
	CreatedAt time.Time `gorm:"not null"`
	UpdatedAt time.Time `gorm:"not null"`
	DeletedAt *time.Time
}
